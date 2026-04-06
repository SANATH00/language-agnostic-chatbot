# ==========================================
# File: main.py
# Description: Entry point of the FastAPI application
# ==========================================

# Importing required modules to initialize FastAPI app and database
from fastapi import FastAPI
from database import engine, Base
from routers import auth, chat, files


# This creates all database tables automatically if they do not exist
Base.metadata.create_all(bind=engine)


# Creating FastAPI application instance
app = FastAPI()


# Including different route modules into the main application
# This connects all API endpoints (auth, chat, file upload, etc.) to the app
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(files.router)