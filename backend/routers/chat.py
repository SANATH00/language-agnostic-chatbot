# ==========================================
# File: chat.py
# Description: Handles chatbot interaction and chat history
# ==========================================

# Importing required modules for routing, database, and authentication
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import verify_token
from langdetect import detect

# Importing retrieval function (Step 7)
from retrieval import retrieve_relevant_chunks

# Creating router instance
router = APIRouter()


# 💬 Chat endpoint
# 🔹 New endpoint for Retrieval-Based Response (RAG)
@router.post('/api/rag-response')
def rag_response(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db)
):

    # 🔹 Step 1: Get relevant chunks from uploaded PDFs
    chunks, sources = retrieve_relevant_chunks(
        request.message,
        db,
        top_k=3  # get top 3 relevant matches
    )

    # 🔹 Step 2: Check if any relevant content found
    if chunks and chunks[0]:
        response = f"Based on uploaded documents: {chunks[0][:300]}..."
        source = sources[0]
    else:
        response = "No relevant information found in uploaded documents."
        source = "No document"

    # 🔹 Step 3: Return structured response
    return {
        "response": response,
        "source": source,
        "chunks": chunks
    }
# 📜 Get chat history
# This endpoint returns all chat logs of the logged-in user
@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    # Get current user
    db_user = db.query(models.User).filter(models.User.email == current_user).first()

    # Fetch all chat logs of that user
    logs = db.query(models.ChatLog).filter(models.ChatLog.user_id == db_user.id).all()

    # Return formatted response
    return [
        {
            "user_message": log.user_message,
            "bot_response": log.bot_response,
            "language": log.language,
            "timestamp": log.timestamp
        }
        for log in logs
    ]