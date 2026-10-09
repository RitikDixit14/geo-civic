import requests
import io
from PIL import Image

# Create dummy image
img = Image.new('RGB', (100, 100), color = 'red')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_byte_arr = img_byte_arr.getvalue()

files = {'image': ('test.jpg', img_byte_arr, 'image/jpeg')}
data = {'description': 'pothole on road', 'latitude': 0.0, 'longitude': 0.0}

try:
    response = requests.post('http://127.0.0.1:8000/analyze', files=files, data=data)
    print("Status Code:", response.status_code)
    print("Response body:", response.text)
except Exception as e:
    print("Error connecting to server:", e)
