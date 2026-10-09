# MEMBER 2 — AI/ML
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
import os
import io
import json
from PIL import Image
from dotenv import load_dotenv
import imagehash
import traceback

load_dotenv()

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
    img_hash = str(imagehash.phash(pil_image))

    api_key = os.getenv("GEMINI_API_KEY")
    
    if api_key:
        try:
            from google import genai
            from google.genai import types
            
            client = genai.Client(api_key=api_key)
            
            prompt = f"Analyze this image of a city issue. Description provided by user: '{description}'. Return a JSON with the following exact keys: 'category' (one of: pothole, water_leakage, streetlight, garbage, other), 'severity' (low, medium, high, critical), 'severity_score' (integer 1-100), and 'confidence' (float 0.0-1.0)."
            
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=[prompt, pil_image],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            result_json = json.loads(response.text)
            
            return {
                "category": result_json.get("category", "other"),
                "severity": result_json.get("severity", "medium"),
                "severity_score": result_json.get("severity_score", 50),
                "confidence": result_json.get("confidence", 0.8),
                "mode": "gemini",
                "image_hash": img_hash
            }
        except Exception as e:
            with open("gemini_error.log", "a") as f:
                f.write(f"Gemini error: {str(e)}\n")
                traceback.print_exc(file=f)
            # Fallback to demo mode on error
            pass

    # Demo Mode Fallback algorithm
    from app.classifier import classify_image
    from app.severity import calculate_severity
    
    # We pass 'demo' to get the mock values, but we will return 'gemini' if api_key exists
    category, confidence = classify_image(pil_image, description, image.filename, img_hash, "demo")
    severity_score, severity = calculate_severity(category, description, img_hash, "demo")

    final_mode = "gemini" if api_key else "demo"

    return {
        "category": category,
        "severity": severity,
        "severity_score": severity_score,
        "confidence": confidence,
        "mode": final_mode,
        "image_hash": img_hash
    }
