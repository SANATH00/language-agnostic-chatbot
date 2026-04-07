# chat.py - Chat API Endpoint for LAC Chatbot
# Handles user messages, detects language, queries RAG pipeline
# and returns a response with the source document

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from langdetect import detect  # Language detection library
import models
from pydantic import BaseModel
from retrieval import retrieve_relevant_chunks  # RAG retrieval function

router = APIRouter()

# Request body schema
class ChatRequest(BaseModel):
    message: str          # User's chat message
    sessionId: str = 'default'  # Session identifier

@router.post('/chat')
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # Step 1: Detect the language of the user's message
    lang_map = {'en': 'English', 'es': 'Spanish', 'hi': 'Hindi', 'fr': 'French'}
    detected_language = lang_map.get(detect(request.message), 'Unknown')

    # Step 2: Try to find a relevant answer from uploaded PDFs using RAG
    chunks, sources = retrieve_relevant_chunks(request.message, db, top_k=1)

    if chunks and chunks[0]:
        # Answer found in uploaded documents
        bot_reply = f'Based on uploaded documents: {chunks[0][:300]}...'
        source = sources[0]  # Name of the PDF the answer came from
    else:
        # No relevant document found - fall back to rule-based response
        bot_reply = f'Echo: {request.message}'
        source = 'Rule-based response'

    # Step 3: Save the conversation to the database
    new_chat = models.ChatLog(
        user_id=1,
        session_id=request.sessionId,
        user_message=request.message,
        bot_response=bot_reply,
        language=detected_language
    )
    db.add(new_chat)
    db.commit()

    # Step 4: Return response with source and detected language
    return {
        'response': bot_reply,
        'source': source,
        'language': detected_language
    }
