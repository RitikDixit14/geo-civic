# City Issue Reporter

**Everyday city problems ko report aur prioritize karne wala AI-based platform**

## 1. Project Overview
A complete civic issue reporting platform where citizens can upload photos of city problems. The platform uses AI to automatically identify the issue category (Pothole, Streetlight, Garbage, Water Leakage) and estimate its severity. The backend detects duplicates and calculates a priority score. Authorities have a dashboard to manage, filter, assign, and resolve tickets.

## 2. Features
- **Citizen App:** Submit issues with photos, GPS location, and description. Track status.
- **AI Service:** Automatically classifies image categories and evaluates severity.
- **Duplicate Detection:** Prevents multiple tickets for the same issue within a 50m radius.
- **Priority Engine:** Calculates issue priority based on severity, duplicate count, and time pending.
- **Authority Dashboard:** Map, charts, priority tables, and ticket management for authorities.

## 3. Architecture
- Frontend (Citizen + Dashboard): React, Vite, Tailwind CSS, Leaflet, Recharts
- Backend: Node.js, Express, PostgreSQL, PostGIS
- AI Service: Python, FastAPI, Pillow, ImageHash

## 4. Team Member Responsibilities
- **Member 1 (Frontend):** Citizen-facing application, report submission flow.
- **Member 2 (AI/ML):** Image classification, severity estimation, duplicate detection.
- **Member 3 (Backend):** REST API, PostgreSQL database, Priority engine.
- **Member 4 (Dashboard):** Authority dashboard, Analytics, Map integration.

## 5. Folder Structure
- `frontend/`: React + Vite app
- `backend/`: Node.js Express server
- `ai-service/`: Python FastAPI service
- `database/`: Init and seed SQL scripts

## 6. Installation
### Prerequisites
- Node.js
- Python 3.10+
- Docker and Docker Compose (recommended)

## 7. Environment Variables
Copy `.env.example` to `.env` and fill the variables.

## 8. Database Setup
The database uses PostgreSQL and PostGIS. If not using Docker, manually run scripts from `database/`.

## 9. Docker Setup
```bash
docker compose up --build
```

## 10. API Documentation
Detailed API documentation is implemented in the code (check routes and endpoints).

## 11. AI Model Setup
The AI supports two modes:
- `MODEL_MODE=demo` (Simulated predictions based on text/hashes)
- `MODEL_MODE=production` (Runs actual CNN models if weights are present in `models/`)

## 12. Demo Mode
In Demo Mode, AI responses are deterministic and transparently marked as simulated. Duplicate checks rely on actual distance and hashes.

## 13. Production Mode
Change `MODEL_MODE=production` in `.env` and provide MobileNet/ResNet model weights.

## 14. Testing
Run tests via respective framework testing scripts. (Check backend/frontend folders)

## 15. Troubleshooting
If db fails to connect, ensure PostGIS image is used and port 5432 is not occupied. Ensure node dependencies are installed before running outside docker.

## 16. Future Improvements
- Implement real CNN model weights for production.
- Real-time websocket updates for ticket tracking.
- Mobile native apps using React Native or Flutter.
