# retrieve.py - RAG Retrieval API Endpoint for LAC Chatbot
# Exposes a POST /api/retrieve endpoint that accepts a query
# and returns the most relevant chunks from uploaded PDFs

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db  # Database session dependency
from retrieval import retrieve_relevant_chunks  # TF-IDF retrieval function
from pydantic import BaseModel

router = APIRouter()

# Request body schema
class RetrieveRequest(BaseModel):
    query: str      # The user's search query
    top_k: int = 3  # Number of results to return (default 3)

@router.post('/api/retrieve')
def retrieve(request: RetrieveRequest, db: Session = Depends(get_db)):
    # Step 1: Run TF-IDF retrieval against all uploaded PDFs
    chunks, sources = retrieve_relevant_chunks(request.query, db, request.top_k)

    # Step 2: If no documents found, return empty results
    if not chunks:
        return {
            'query': request.query,
            'results': [],
            'message': 'No documents found. Please upload a PDF first.'
        }

    # Step 3: Build results list with rank, source filename and content
    results = []
    for i, (chunk, source) in enumerate(zip(chunks, sources)):
        results.append({
            'rank': i + 1,          # Relevance rank
            'source': source,        # PDF filename the chunk came from
            'content': chunk         # The actual text chunk
        })

    # Step 4: Return query and ranked results
    return {
        'query': request.query,
        'results': results
    }
