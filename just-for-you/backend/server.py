
import os
import smtplib

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from email.message import EmailMessage
load_dotenv()

app = FastAPI(title="Just For You API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResponseData(BaseModel):
    reason: str
    message: str = ""

@app.get("/api/")
async def home():
    return {"message": "Just For You is ready"}


@app.post("/api/responses")
async def submit_response(data: ResponseData):

    email_user = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_APP_PASSWORD")
    email_to = os.getenv("EMAIL_TO")

    if not email_user or not email_password or not email_to:
        raise HTTPException(
            status_code=503,
            detail="Email configuration is missing"
        )

    email = EmailMessage()
    email["Subject"] = "New Just For You Response ❤️"
    email["From"] = email_user
    email["To"] = email_to

    email.set_content(
        f"""
New response received!

Reason: {data.reason}

Message: {data.message}
"""
    )

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.starttls()
            smtp.login(email_user, email_password)
            smtp.send_message(email)

        print("EMAIL SENT SUCCESSFULLY!")

        return {"message": "Email sent successfully"}

    except Exception as e:
        print("EMAIL ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Email sending failed"
        )
