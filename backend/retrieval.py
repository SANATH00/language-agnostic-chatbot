# retrieval.py - TF-IDF Retrieval Module for LAC Chatbot RAG Pipeline
# This module finds the most relevant text chunks from uploaded PDFs
# based on the user's query using TF-IDF and cosine similarity

from sklearn.feature_extraction.text import TfidfVectorizer  # Converts text to numerical vectors
from sklearn.metrics.pairwise import cosine_similarity  # Measures similarity between vectors
import numpy as np  # For sorting similarity scores
from sqlalchemy.orm import Session
from models import PDFFile

def retrieve_relevant_chunks(query: str, db: Session, top_k: int = 3):
    # Step 1: Get all uploaded PDFs from the database
    pdfs = db.query(PDFFile).all()

    if not pdfs:
        # No PDFs uploaded yet
        return None, None

    all_chunks = []
    chunk_sources = []

    # Step 2: Collect all chunks from all PDFs
    for pdf in pdfs:
        if pdf.chunks:
            import ast
            # Convert stored string back to list
            chunks = ast.literal_eval(pdf.chunks)
            for chunk in chunks:
                all_chunks.append(chunk)
                # Track which file each chunk came from
                chunk_sources.append(pdf.filename)

    if not all_chunks:
        # PDFs exist but no chunks were extracted
        return None, None

    # Step 3: Use TF-IDF to convert query and chunks into vectors
    vectorizer = TfidfVectorizer(stop_words='english')
    all_texts = [query] + all_chunks  # Query is first, chunks follow
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    # Step 4: Calculate cosine similarity between query and each chunk
    query_vector = tfidf_matrix[0]  # First row is the query
    chunk_vectors = tfidf_matrix[1:]  # Rest are the chunks
    similarities = cosine_similarity(query_vector, chunk_vectors)[0]

    # Step 5: Return top_k most similar chunks
    top_indices = np.argsort(similarities)[::-1][:top_k]
    top_chunks = [all_chunks[i] for i in top_indices]
    top_sources = [chunk_sources[i] for i in top_indices]

    return top_chunks, top_sources
