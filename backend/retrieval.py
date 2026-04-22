from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sqlalchemy.orm import Session
from .models import PDFFile

def retrieve_relevant_chunks(query: str, db: Session, top_k: int = 3):
    pdfs = db.query(PDFFile).all()
    if not pdfs:
        return None, None

    all_chunks = []
    chunk_sources = []

    for pdf in pdfs:
        if pdf.chunks:
            import ast
            chunks = ast.literal_eval(pdf.chunks)
            for chunk in chunks:
                all_chunks.append(chunk)
                chunk_sources.append(pdf.filename)

    if not all_chunks:
        return None, None

    vectorizer = TfidfVectorizer(stop_words='english')
    all_texts = [query] + all_chunks
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    query_vector = tfidf_matrix[0]
    chunk_vectors = tfidf_matrix[1:]
    similarities = cosine_similarity(query_vector, chunk_vectors)[0]

    top_indices = np.argsort(similarities)[::-1][:top_k]
    top_chunks = [all_chunks[i] for i in top_indices]
    top_sources = [chunk_sources[i] for i in top_indices]

    return top_chunks, top_sources