from typing import Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
class ChatRequest(BaseModel):
    message: str
    language: str = "English"
    sessionId: Optional[str] = "default-session"