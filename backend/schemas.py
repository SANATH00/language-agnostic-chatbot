# ==========================================
# File: schemas.py
# Description: Defines Pydantic schemas for request and response validation
# ==========================================

# Importing BaseModel for creating schemas and EmailStr for email validation
from pydantic import BaseModel, EmailStr


# Schema for user registration
# It validates the data sent when a new user signs up
class UserCreate(BaseModel):
    username: str          # Username of the user
    email: EmailStr        # Valid email format is enforced
    password: str          # Plain password (will be hashed in backend)


# Schema for user login
# Used to validate login credentials
class UserLogin(BaseModel):
    email: EmailStr        # User email
    password: str          # User password


# Schema for chatbot request
# This defines what data the frontend sends to the /chat endpoint
class ChatRequest(BaseModel):
    message: str           # User's input message
    language: str          # Language of the message (for multilingual support)
    sessionId: str | None = None   # Optional session ID to track conversation


# Schema for chatbot response (VERY IMPORTANT for Step 7)
# This defines what the backend sends back to the frontend
class ChatResponse(BaseModel):
    response: str          # Chatbot's reply
    source: str            # Source of response (e.g., "PDF" or "LLM")
