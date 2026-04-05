from fastapi import FastAPI
from database import engine, Base
from routers import auth, chat, files

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(files.router)