# MEMBER 2 — AI/ML
import random

def classify_image(pil_image, description, filename, img_hash, mode="demo"):
    if mode == "demo":
        desc_lower = description.lower() if description else ""
        file_lower = filename.lower() if filename else ""
        combined = desc_lower + " " + file_lower

        # Order of precedence as per requirements
        if any(w in combined for w in ["water leak", "water leakage", "leakage", "leaking pipe", "pipe leak", "water pipe"]):
            return "water_leakage", round(random.uniform(0.90, 0.97), 2)
        elif any(w in combined for w in ["pothole", "road damage", "road hole", "crater", "broken road", "road"]):
            return "pothole", round(random.uniform(0.90, 0.97), 2)
        elif any(w in combined for w in ["streetlight", "street light", "lamp", "lamp post", "light pole", "electric pole", "broken light"]):
            return "streetlight", round(random.uniform(0.90, 0.97), 2)
        elif any(w in combined for w in ["garbage", "trash", "waste", "dump", "litter", "rubbish", "plastic waste"]):
            return "garbage", round(random.uniform(0.90, 0.97), 2)
        
        # Fallback based on hash
        hash_int = int(img_hash, 16)
        cat_idx = hash_int % 4
        categories = ["pothole", "streetlight", "garbage", "water_leakage"]
        return categories[cat_idx], round(random.uniform(0.65, 0.79), 2)
    else:
        raise RuntimeError("Production model weights not found in models/ directory. Switch to MODEL_MODE=demo")
