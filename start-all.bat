@echo off
echo Starting City Issue Reporter Services...

echo Starting AI Service...
start cmd /k "cd ai-service && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo Starting Backend...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo All services started in separate windows!
pause
