# ==========================================
# File: files.py
# Description: Handles PDF upload, storage, and download
# ==========================================

# Importing required modules
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from database import get_db
import models
from auth import verify_token
import os

# Library for extracting text from PDF
from PyPDF2 import PdfReader


# Creating router instance
router = APIRouter()


# 📄 Upload PDF endpoint
# This endpoint allows users to upload PDF files and stores them in the system
@router.post("/upload-pdf")
def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    # Check if uploaded file is PDF
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    # Get current user from database
    db_user = db.query(models.User).filter(models.User.email == current_user).first()

    # Create uploads folder if it doesn't exist
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    # Define file path
    file_path = os.path.join(upload_dir, file.filename)

    # 💾 Save file to folder
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # 🔥 Extract text from PDF (IMPORTANT for Step 5 & 6)
    extracted_text = ""
    try:
        reader = PdfReader(file_path)
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text
    except Exception as e:
        extracted_text = ""

    # 🗄 Save metadata + extracted text in database
    new_file = models.PDFFile(
        user_id=db_user.id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text   # IMPORTANT FIELD
    )

    db.add(new_file)
    db.commit()

    return {"message": "PDF uploaded successfully"}


# 📥 Download PDF endpoint
# This endpoint allows users to download their uploaded PDFs
@router.get("/download/{file_id}")
def download_pdf(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    # Get current user
    db_user = db.query(models.User).filter(models.User.email == current_user).first()

    # Find file in database
    pdf_file = db.query(models.PDFFile).filter(models.PDFFile.id == file_id).first()

    # If file not found
    if not pdf_file:
        raise HTTPException(status_code=404, detail="File not found")

    # 🔒 Security check: ensure file belongs to logged-in user
    if pdf_file.user_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this file")

    # Check file exists in system
    if not os.path.exists(pdf_file.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    # Return file as response
    return FileResponse(
        path=pdf_file.file_path,
        filename=pdf_file.filename,
        media_type="application/pdf"
    )