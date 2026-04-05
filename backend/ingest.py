import fitz  # PyMuPDF
import os
from sqlalchemy.orm import Session
from database import SessionLocal
from models import PDFFile

def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    full_text = ''
    for page in doc:
        full_text += page.get_text()
    return full_text

def chunk_text(text: str, chunk_size: int = 500) -> list:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = ' '.join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

def ingest_pdf(file_path: str, filename: str):
    db: Session = SessionLocal()
    try:
        # Extract text
        print(f'Extracting text from {filename}...')
        text = extract_text_from_pdf(file_path)

        # Chunk the text
        chunks = chunk_text(text)
        print(f'Created {len(chunks)} chunks')

        # Store in database
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
    # Test with a sample PDF
    test_path = 'uploads/test.pdf'
    if os.path.exists(test_path):
        ingest_pdf(test_path, 'test.pdf')
    else:
        print('Place a test.pdf in the uploads/ folder to test')
