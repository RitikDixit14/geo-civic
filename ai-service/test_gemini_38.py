import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
import traceback

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
print('API Key starts with:', api_key[:4] if api_key else 'None')

try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents='Hello, are you there?'
    )
    print('Response:', response.text)
except Exception as e:
    print('Error:', e)
    traceback.print_exc()
