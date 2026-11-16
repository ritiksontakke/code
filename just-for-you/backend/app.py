import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Just For You API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResponseData(BaseModel):
    reason: str
    message: str = ""

@app.get("/api/")
def home():
    return {"message": "Just For You is ready"}

@app.post("/api/responses")
def submit_response(data: ResponseData):
    if not os.getenv("EMERGENT_EMAIL_KEY"):
        raise HTTPException(
            status_code=503,
            detail="Email notification is not configured yet"
        )

    raise HTTPException(
        status_code=501,
        detail="Email sending integration still needs to be configured"
    )