# ==========================================
# File: database.py
# Description: Handles connection to PostgreSQL database
# ==========================================
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# This is the database connection URL
# It contains username, password, host, port, and database name
DATABASE_URL = "postgresql://postgres:12345@localhost/chatbot_db"

# create_engine is used to establish connection with the PostgreSQL database
engine = create_engine(DATABASE_URL)

# SessionLocal is used to interact with the database
# It allows us to perform operations like insert, update, delete, and query
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is used as a foundation to create database models (tables)
Base = declarative_base()

# This function provides a database session to API endpoints
# It ensures the connection is properly opened and closed
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()