# ==========================================
# File: auth.py
# Description: Handles user authentication and JWT token management
# ==========================================

# Importing required libraries for authentication and security
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

# Secret key used to sign JWT tokens (should be stored in .env in production)
SECRET_KEY = "niha_super_secret_key"

# Algorithm used for encoding JWT
ALGORITHM = "HS256"

# Token expiry time (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 🔐 This function hashes the plain password before storing in database
# It ensures passwords are stored securely (not in plain text)
def hash_password(password: str):
    return pwd_context.hash(password)


# 🔍 This function verifies the entered password with the stored hashed password
# Returns True if password matches, otherwise False
def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


# 🎟 This function creates a JWT access token for authenticated users
# The token contains user data and expiry time
def create_access_token(data: dict):
    to_encode = data.copy()

    # Set token expiration time
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    # Encode the token using secret key and algorithm
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# OAuth2 scheme to extract token from request header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# 🔐 This function verifies and decodes the JWT token
# It ensures the user is authenticated before accessing protected routes
# Remove the OAuth2 scheme dependency from verify_token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # check both "sub" and "email" since token uses "email" key
        email: str = payload.get("sub") or payload.get("email")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")