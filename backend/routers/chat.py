# ==========================================
# File: chat.py
# Description: Handles chatbot interaction and chat history
# ==========================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import verify_token
from langdetect import detect
from ..retrieval import retrieve_relevant_chunks

router = APIRouter()

@router.post("/chat", response_model=schemas.ChatResponse)
def chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_user = db.query(models.User).filter(models.User.email == current_user).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    lang_map = {
        "en": "English",
        "es": "Spanish",
        "hi": "Hindi",
        "fr": "French"
    }

    try:
        detected_language = lang_map.get(detect(request.message), "Unknown")
    except:
        detected_language = "Unknown"

    try:
        chunks, sources = retrieve_relevant_chunks(request.message, db)
        relevant_chunk = chunks[0] if chunks else None
        source = sources[0] if sources else "Rule-based response"
    except Exception as e:
        print("Retrieval error:", e)
        relevant_chunk = None
        source = "Rule-based response"

    if relevant_chunk:
        bot_reply = f"Based on your documents: {relevant_chunk}"
    else:
        bot_reply = f"Echo: {request.message}"
        source = "Rule-based response"

    new_chat = models.ChatLog(
        user_id=db_user.id,
        session_id=request.sessionId,
        user_message=request.message,
        bot_response=bot_reply,
        language=detected_language
    )

    db.add(new_chat)
    db.commit()

    return {
        "response": bot_reply,
        "source": source
    }


@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):
    db_user = db.query(models.User).filter(models.User.email == current_user).first()
    logs = db.query(models.ChatLog).filter(models.ChatLog.user_id == db_user.id).all()

    return [
        {
            "user_message": log.user_message,
            "bot_response": log.bot_response,
            "language": log.language,
            "timestamp": log.timestamp
        }
        for log in logs
    ]