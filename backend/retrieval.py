import models
def retrieve_relevant_chunks(query, db, top_k=3):

    # 🔹 Get latest uploaded file (IMPORTANT FIX)
    latest_pdf = db.query(models.PDFFile).order_by(models.PDFFile.id.desc()).first()

    if not latest_pdf or not latest_pdf.extracted_text:
        return [], []

    chunks = [latest_pdf.extracted_text[:300]]
    sources = [latest_pdf.filename]

    return chunks, sources