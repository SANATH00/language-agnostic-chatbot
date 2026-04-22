from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from ..database import get_db
from .. import models
from ..auth import verify_token
from typing import Optional
import os
import pdfplumber
from PyPDF2 import PdfReader

router = APIRouter()

def chunk_text(text, chunk_size=500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "").strip()
    current_user = verify_token(token)

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    db_user = db.query(models.User).filter(models.User.email == current_user).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    contents = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    extracted_text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text
        print(f"pdfplumber extracted {len(extracted_text)} characters")
    except Exception as e:
        print("pdfplumber failed, trying PyPDF2:", e)
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text
            print(f"PyPDF2 extracted {len(extracted_text)} characters")
        except Exception as e2:
            print("PyPDF2 also failed:", e2)

    chunks = chunk_text(extracted_text) if extracted_text else []
    chunks_str = str(chunks)

    new_file = models.PDFFile(
        user_id=db_user.id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        chunks=chunks_str
    )
    db.add(new_file)
    db.commit()

    return {"message": "PDF uploaded successfully"}


@router.get("/download/{file_id}")
def download_pdf(
    file_id: int,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "").strip()
    current_user = verify_token(token)

    db_user = db.query(models.User).filter(models.User.email == current_user).first()
    pdf_file = db.query(models.PDFFile).filter(models.PDFFile.id == file_id).first()

    if not pdf_file:
        raise HTTPException(status_code=404, detail="File not found")
    if pdf_file.user_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if not os.path.exists(pdf_file.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    return FileResponse(path=pdf_file.file_path, filename=pdf_file.filename, media_type="application/pdf")