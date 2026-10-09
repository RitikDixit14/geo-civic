# MEMBER 2 — AI/ML
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
import os
import io
from PIL import Image
from app.classifier import classify_image
from app.severity import calculate_severity

app = FastAPI()

class AnalyzeResponse(BaseModel):
    category: str
    severity: str
    severity_score: int
    confidence: float
    mode: str
    image_hash: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(
    image: UploadFile = File(...),
    description: str = Form(""),
    latitude: float = Form(0.0),
    longitude: float = Form(0.0)
):
    image_bytes = await image.read()
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    mode = os.getenv("MODEL_MODE", "demo")
    
    # Generate image hash
    import imagehash
    img_hash = str(imagehash.phash(pil_image))

    category, confidence = classify_image(pil_image, description, image.filename, img_hash, mode)
    severity_score, severity = calculate_severity(category, description, img_hash, mode)

    return {
        "category": category,
        "severity": severity,
        "severity_score": severity_score,
        "confidence": confidence,
        "mode": mode,
        "image_hash": img_hash
    }
