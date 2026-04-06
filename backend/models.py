# ==========================================
# File: models.py
# Description: Defines database tables using SQLAlchemy models
# ==========================================

# Importing required modules for defining database tables and columns
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base


# This class represents the users table
# It stores user account details like username, email, password, and role
class User(Base):
    __tablename__ = "users"

    # Unique ID for each user (Primary Key)
    id = Column(Integer, primary_key=True, index=True)

    # Username of the user
    username = Column(String, nullable=False)

    # Email must be unique for each user
    email = Column(String, unique=True, nullable=False)

    # Stores hashed password (not plain text for security)
    hashed_password = Column(String, nullable=False)

    # Stores account creation time
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Role of user (e.g., student, admin)
    role = Column(String, default="student")


# This class represents the chat_logs table in the database
# It stores user messages and chatbot responses
class ChatLog(Base):
    __tablename__ = "chat_logs"

    # Unique ID for each chat record
    id = Column(Integer, primary_key=True, index=True)

    # Links chat to a specific user
    user_id = Column(Integer, ForeignKey("users.id"))

    # Stores user's message
    user_message = Column(Text, nullable=False)

    # Stores chatbot response
    bot_response = Column(Text, nullable=False)

    # Stores language of the message (for multilingual support)
    language = Column(String)

    # Timestamp of when the chat happened
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Session ID to group chats in a session
    session_id = Column(String)


# This class represents user sessions
# It stores login session details for authentication tracking
class Session(Base):
    __tablename__ = "sessions"

    # Unique session ID
    id = Column(Integer, primary_key=True, index=True)

    # Links session to a user
    user_id = Column(Integer, ForeignKey("users.id"))

    # Stores session token (used for authentication)
    token = Column(String, nullable=False)

    # Time when user logged in
    login_time = Column(DateTime(timezone=True), server_default=func.now())

    # Last active time of user
    last_active_at = Column(DateTime(timezone=True), server_default=func.now())


# This class represents uploaded PDF files
# It stores file details and helps in document-based retrieval
class PDFFile(Base):
    __tablename__ = "pdf_files"

    # Unique ID for each uploaded file
    id = Column(Integer, primary_key=True, index=True)

    # Links file to a specific user
    user_id = Column(Integer, ForeignKey("users.id"))

    # Name of the uploaded file
    filename = Column(String, nullable=False)

    # Path where file is stored in system
    file_path = Column(String, nullable=False)

    # Timestamp when file was uploaded
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Stores extracted text from the PDF (used for retrieval)
    extracted_text = Column(Text)