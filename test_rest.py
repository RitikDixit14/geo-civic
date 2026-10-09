import requests
import json

api_key = 'AQ.Ab8RN6I6FKNy6LMdXNVqqlaVHYaEfV_PeNWQWI8xE5fXiMGGJQ'
url = f'https://generativelanguage.googleapis.com/v1beta/models?key={api_key}&pageSize=100'

response = requests.get(url)
data = response.json()
if 'models' in data:
    for model in data['models']:
        print(model['name'])
