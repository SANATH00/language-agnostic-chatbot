# ==========================================
# File: main.py
# Description: Entry point of the FastAPI application
# ==========================================

from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, chat, files, translate, rag

app = FastAPI()

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],        # ✅ this allows Authorization header
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(files.router)
app.include_router(translate.router)
app.include_router(rag.router)