# ==========================================
# File: files.py
# Description: Handles PDF upload, storage, and download
# ==========================================

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from database import get_db
import models
from auth import verify_token
import os
import pdfplumber

# 🔒 File validation limits
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
MAX_PAGES = 50                          # Max 50 pages allowed
MIN_FILE_SIZE_BYTES = 1024              # Minimum 1 KB

router = APIRouter()


# 📤 Upload PDF
@router.post('/upload-pdf')
def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):

    # 🔹 Step 1: Check file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # 🔹 Step 2: Read file content
    contents = file.file.read()

    # 🔹 Debug (optional)
    print("File size MB:", len(contents) / (1024 * 1024))

    # 🔹 Step 3: Validate file size
    if len(contents) < MIN_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File is too small or empty")

    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 10MB limit")

    # 🔹 Step 4: Reset pointer (IMPORTANT)
    file.file.seek(0)

    # 🔹 Step 5: Save TEMP file
    os.makedirs("uploads", exist_ok=True)
    temp_path = f"uploads/temp_{file.filename}"

    with open(temp_path, "wb") as f:
        f.write(contents)

    # 🔹 Step 6: Check number of pages
    with pdfplumber.open(temp_path) as pdf:
        page_count = len(pdf.pages)

    # 🔹 Step 7: Validate pages (OUTSIDE)
    if page_count > MAX_PAGES:
        os.remove(temp_path)
        raise HTTPException(
            status_code=400,
            detail=f"PDF has {page_count} pages. Max allowed is 50"
        )

    # 🔹 Step 8: Save FINAL file (handle duplicates)
    file_path = f"uploads/{file.filename}"

    if os.path.exists(file_path):
        base, ext = os.path.splitext(file.filename)
        file_path = f"uploads/{base}_new{ext}"

    os.rename(temp_path, file_path)

    # 🔹 Step 9: Extract text
    extracted_text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            extracted_text += page.extract_text() or ""

    # 🔹 Step 10: Get user
    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    # 🔹 Step 11: Save to DB
    new_file = models.PDFFile(
        user_id=db_user.id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text
    )

    db.add(new_file)
    db.commit()

    # 🔹 Step 12: Response
    return {
        "message": "PDF uploaded successfully",
        "pages": page_count
    }


# 📥 Download PDF
@router.get("/download/{file_id}")
def download_pdf(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_user = db.query(models.User).filter(
        models.User.email == current_user
    ).first()

    pdf_file = db.query(models.PDFFile).filter(
        models.PDFFile.id == file_id
    ).first()

    if not pdf_file:
        raise HTTPException(status_code=404, detail="File not found")

    if pdf_file.user_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if not os.path.exists(pdf_file.file_path):
        raise HTTPException(status_code=404, detail="File missing on server")

    return FileResponse(
        path=pdf_file.file_path,
        filename=pdf_file.filename,
        media_type="application/pdf"
    )