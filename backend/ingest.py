# ingest.py - PDF Ingestion Module for LAC Chatbot RAG Pipeline
# This module handles extracting text from uploaded PDFs and splitting into chunks

import fitz  # PyMuPDF - library for reading PDF files
import os
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import PDFFile

def extract_text_from_pdf(pdf_path: str) -> str:
    # Open the PDF file from the given path
    doc = fitz.open(pdf_path)
    full_text = ''
    # Loop through each page and extract its text
    for page in doc:
        full_text += page.get_text()
    return full_text

def chunk_text(text: str, chunk_size: int = 500) -> list:
    # Split the extracted text into smaller chunks for better retrieval
    # chunk_size = number of words per chunk
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = ' '.join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

def ingest_pdf(file_path: str, filename: str):
    # Main function to ingest a PDF into the database
    db: Session = SessionLocal()
    try:
        print(f'Extracting text from {filename}...')
        # Step 1: Extract raw text from PDF
        text = extract_text_from_pdf(file_path)

        # Step 2: Break text into chunks
        chunks = chunk_text(text)
        print(f'Created {len(chunks)} chunks')

        # Step 3: Store the PDF record with extracted text in database
        pdf_record = PDFFile(
            filename=filename,
            extracted_text=text,
            chunks=str(chunks)
        )
        db.add(pdf_record)
        db.commit()
        print(f'Stored {filename} in database successfully!')
        return chunks

    except Exception as e:
        print(f'Error: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    # Test the ingestion with a sample PDF in the uploads folder
    test_path = 'uploads/test.pdf'
    if os.path.exists(test_path):
        ingest_pdf(test_path, 'test.pdf')
    else:
        print('Place a test.pdf in the uploads/ folder to test')
