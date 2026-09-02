from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_model.predict import predict_email  # ✅ correct path

app = FastAPI()

# CORS — here it allows Chrome extension to call the localhost API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    subject: str
    body: str

@app.get("/")
def home():
    return {"message": "PhishGuard API is running"}

@app.post("/predict")
def predict(request: EmailRequest):
    # Combine subject + body — subject carries strong phishing signals
    combined_text = f"Subject: {request.subject}\n\n{request.body}"
    print("=" * 80)
    print(combined_text)
    print("=" * 80)
    label, confidence = predict_email(combined_text)
    
    return {
        "prediction": label,
        "confidence": round(confidence, 4)
    }
