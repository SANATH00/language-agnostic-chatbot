import models

def retrieve_relevant_chunks(query: str, db):
    pdfs = db.query(models.PDFFile).all()

    print("🚀 RETRIEVAL FUNCTION CALLED")

    for pdf in pdfs:
        if pdf.extracted_text:
            print("✅ FOUND PDF TEXT")
            return pdf.extracted_text[:300]

    print("❌ NO TEXT FOUND")
    return None