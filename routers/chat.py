from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import verify_token
from langdetect import detect

router = APIRouter()

@router.post("/chat")
def chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_token)
):

    db_user = db.query(models.User).filter(models.User.email == current_user).first()

    bot_reply = f"Echo: {request.message}"
    lang_map = {
        "en": "English",
        "es": "Spanish",
        "hi": "Hindi",
        "fr": "French"
    }

    detected_language = lang_map.get(detect(request.message), "Unknown")

    new_chat = models.ChatLog(
    user_id=db_user.id,
    session_id=request.sessionId,
    user_message=request.message,
    bot_response=bot_reply,
    language=detected_language
)

    db.add(new_chat)
    db.commit()

    return {"response": bot_reply}

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