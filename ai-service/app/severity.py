# MEMBER 2 — AI/ML

def get_severity_label(score):
    if score <= 25: return "Low"
    elif score <= 50: return "Medium"
    elif score <= 75: return "High"
    else: return "Critical"

def calculate_severity(category, description, img_hash, mode="demo"):
    if mode == "demo":
        desc_lower = description.lower() if description else ""
        score = None

        if category == "pothole":
            if "small" in desc_lower: score = 25
            elif "medium" in desc_lower: score = 50
            elif "large" in desc_lower: score = 75
            
            if score is None: score = 50
            if "deep" in desc_lower: score += 15
            if "major" in desc_lower: score += 15
            if "dangerous" in desc_lower: score += 15

        elif category == "streetlight":
            if "dangerous" in desc_lower: score = 95
            elif "fallen" in desc_lower: score = 90
            elif "not working" in desc_lower: score = 70
            elif "broken" in desc_lower: score = 60
            elif "minor" in desc_lower or "dim" in desc_lower: score = 30
            else: score = 50

        elif category == "garbage":
            if "road blocked" in desc_lower: score = 90
            elif "overflowing" in desc_lower: score = 80
            elif "large" in desc_lower: score = 70
            elif "medium" in desc_lower: score = 50
            elif "small" in desc_lower: score = 25
            else: score = 50

        elif category == "water_leakage":
            if "road flooded" in desc_lower: score = 95
            elif "flooding" in desc_lower: score = 90
            elif "heavy leak" in desc_lower: score = 75
            elif "moderate" in desc_lower: score = 50
            elif "small" in desc_lower: score = 30
            else: score = 50
            
        if score is None or (score == 50 and not desc_lower):
            # Deterministic hash fallback between 40 and 70
            hash_int = int(img_hash, 16)
            score = 40 + (hash_int % 31)
            
        score = min(max(score, 0), 100)
        return score, get_severity_label(score)
    else:
        raise RuntimeError("Production model weights not found in models/ directory. Switch to MODEL_MODE=demo")
