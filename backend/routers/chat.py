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
# This endpoint receives user message, processes it, and returns a response
@router.post("/chat", response_model=schemas.ChatResponse)
def chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):

    # 👇 EVERYTHING must be inside this function (same indentation)

    db_user = db.query(models.User).filter(models.User.email == current_user).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    lang_map = {
        "en": "English",
        "es": "Spanish",
        "hi": "Hindi",
        "fr": "French"
    }

    # SAFE language detect
    try:
        detected_language = lang_map.get(detect(request.message), "Unknown")
    except:
        detected_language = "Unknown"

    # SAFE retrieval
    try:
        relevant_chunk = retrieve_relevant_chunks(request.message, db)
    except Exception as e:
        print("Retrieval error:", e)
        relevant_chunk = None

    if relevant_chunk:
        bot_reply = relevant_chunk
        source = "PDF"
    else:
        bot_reply = f"Echo: {request.message}"
        source = "LLM"

    # Save to DB
    new_chat = models.ChatLog(
        user_id=db_user.id,
        session_id=request.sessionId,
        user_message=request.message,
        bot_response=bot_reply,
        language=detected_language
    )

    db.add(new_chat)
    db.commit()

    # ✅ THIS MUST BE INSIDE FUNCTION
    return {
        "response": bot_reply,
        "source": source
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