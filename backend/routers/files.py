from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from database import get_db
import models
from auth import verify_token
import os
from sqlalchemy.orm import Session
from ingest import extract_text_from_pdf, chunk_text

router = APIRouter()

@router.post('/upload-pdf')
def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Only PDF files allowed')

    db_user = db.query(models.User).filter(models.User.email == current_user).first()

    upload_dir = 'uploads'
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    # Save file to folder
    with open(file_path, 'wb') as buffer:
        buffer.write(file.file.read())

    # Extract text and chunks
    extracted_text = extract_text_from_pdf(file_path)
    chunks = chunk_text(extracted_text)

    # Save metadata + extracted text in DB
    new_file = models.PDFFile(
        user_id=db_user.id,
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        chunks=str(chunks)
    )
    db.add(new_file)
    db.commit()

    return {'message': 'PDF uploaded and processed successfully', 'chunks': len(chunks)}

@router.get('/download/{file_id}')
def download_pdf(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_user = db.query(models.User).filter(models.User.email == current_user).first()
    pdf_file = db.query(models.PDFFile).filter(models.PDFFile.id == file_id).first()

    if not pdf_file:
        raise HTTPException(status_code=404, detail='File not found')

    if pdf_file.user_id != db_user.id:
        raise HTTPException(status_code=403, detail='Not authorized to access this file')

    if not os.path.exists(pdf_file.file_path):
        raise HTTPException(status_code=404, detail='File not found on server')

    return FileResponse(
        path=pdf_file.file_path,
        filename=pdf_file.filename,
        media_type='application/pdf'
    )
