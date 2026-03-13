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
    language: str
    sessionId: str | None = None