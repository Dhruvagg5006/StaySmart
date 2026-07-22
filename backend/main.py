from fastapi import FastAPI
from app.utils.db import Base,engine
from app.user.models import UserModel
from fastapi.middleware.cors import CORSMiddleware
from app.user import routes
from app.utils.settings import setting
import http


Base.metadata.create_all(bind=engine)

app=FastAPI(title="StaySmart Backend")

app.include_router(routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4028",
        "http://127.0.0.1:4028",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message":"StaySmart Backend API is running"
    }