from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from langdetect import detect

router = APIRouter()

@router.post("/chat")
def chat(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
):
    bot_reply = f"Echo: {request.message}"
    lang_map = {"en": "English", "es": "Spanish", "hi": "Hindi", "fr": "French"}
    detected_language = lang_map.get(detect(request.message), "Unknown")

    new_chat = models.ChatLog(
        user_id=1,
        session_id=request.sessionId,
        user_message=request.message,
        bot_response=bot_reply,
        language=detected_language
    )
    db.add(new_chat)
    db.commit()

    return {"response": bot_reply}