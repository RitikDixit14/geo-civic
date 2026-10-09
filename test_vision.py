import requests
import json
import base64
from PIL import Image
import io

import os
api_key = os.getenv('GEMINI_API_KEY', 'YOUR_API_KEY_HERE')

img = Image.new('RGB', (100, 100), color = 'red')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_b64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

for model in ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash']:
    print(f"Testing {model}...")
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}'
    headers = {'Content-Type': 'application/json'}
    data = {
        'contents': [{'parts': [{'text': 'What is this?'}, {'inline_data': {'mime_type': 'image/jpeg', 'data': img_b64}}]}]
    }
    response = requests.post(url, headers=headers, json=data)
    print("Status:", response.status_code)
    if response.status_code == 200:
        print("Success!")
        break
