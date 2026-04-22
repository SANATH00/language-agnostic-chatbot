# ==========================================
# File: files.py
# Description: Handles PDF upload, storage, and download
# ==========================================

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

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
MAX_PAGES = 50
MIN_FILE_SIZE_BYTES = 1024

router = APIRouter()

def chunk_text(text, chunk_size=500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

@router.post('/upload-pdf')
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "").strip()
    current_user = verify_token(token)

    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await file.read()

    if len(contents) < MIN_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File is too small or empty")
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 10MB limit")

    os.makedirs("uploads", exist_ok=True)
    temp_path = f"uploads/temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    with pdfplumber.open(temp_path) as pdf:
        page_count = len(pdf.pages)

    if page_count > MAX_PAGES:
        os.remove(temp_path)
        raise HTTPException(status_code=400, detail=f"PDF has {page_count} pages. Max allowed is 50")

    file_path = f"uploads/{file.filename}"
    if os.path.exists(file_path):
        base, ext = os.path.splitext(file.filename)
        file_path = f"uploads/{base}_new{ext}"
    os.rename(temp_path, file_path)

    extracted_text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted_text += page.extract_text() or ""
        print(f"pdfplumber extracted {len(extracted_text)} characters")
    except Exception as e:
        print("pdfplumber failed, trying PyPDF2:", e)
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text
        except Exception as e2:
            print("PyPDF2 also failed:", e2)

    db_user = db.query(models.User).filter(models.User.email == current_user).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    chunks = chunk_text(extracted_text) if extracted_text else []

    new_file = models.PDFFile(
        user_id=db_user.id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        chunks=str(chunks)
    )
    db.add(new_file)
    db.commit()

    return {"message": "PDF uploaded successfully", "pages": page_count}


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
        raise HTTPException(status_code=404, detail="File missing on server")

    return FileResponse(path=pdf_file.file_path, filename=pdf_file.filename, media_type="application/pdf")