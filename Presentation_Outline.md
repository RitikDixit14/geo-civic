# Slide 1: Introduction
**Title:** City Issue Reporter: AI-Powered Civic Platform
**Subtitle:** Transforming Urban Problem Resolution

* **Overview:** A complete platform empowering citizens to easily report everyday city problems like potholes, broken streetlights, or water leakage.
* **Smart Triage:** Uses Artificial Intelligence to automatically categorize issues and estimate their severity from uploaded photos.
* **Geospatial Intelligence:** Automatically detects and merges duplicate reports within a 50-meter radius using location data and image hashing.
* **Authority Command Center:** Equips city officials with a real-time, map-based dashboard and priority scoring engine for rapid, organized resolution.

---

# Slide 2: Member 1 - Citizen Application
**Title:** Citizen Frontend & Reporting Flow
**Role:** Frontend Developer

* **User Experience:** Developed the responsive, citizen-facing web application ensuring a frictionless reporting experience.
* **Data Capture:** Implemented seamless photo uploading and automatic GPS coordinate extraction for accurate reporting.
* **Status Tracking:** Designed an intuitive "My Reports" interface allowing citizens to track the real-time status of their submitted tickets.
* **Tech Stack:** React, Vite, Tailwind CSS, HTML5 Geolocation API.

---

# Slide 3: Member 2 - AI Engine
**Title:** AI Service & Image Analysis
**Role:** Machine Learning / Python Developer

* **Automated Classification:** Built a Python-based FastAPI service that processes citizen photos to automatically identify the issue category.
* **Severity Estimation:** Engineered logic to evaluate image context and assign an initial severity score (High, Medium, Low).
* **Duplicate Detection:** Implemented perceptual image hashing to compare incoming photos with existing reports, aiding the duplicate-prevention system.
* **Tech Stack:** Python, FastAPI, Pillow, ImageHash, RESTful Microservices.

---

# Slide 4: Member 3 - Core Backend
**Title:** Backend API & Priority Engine
**Role:** Backend Developer & Database Architect

* **API Architecture:** Architected the secure Node.js/Express REST API serving both the citizen app and the authority dashboard.
* **Spatial Database:** Designed the PostgreSQL database and utilized the **PostGIS** extension to execute complex geospatial queries (e.g., 50m radius checks).
* **Priority Algorithm:** Developed the core "Priority Engine" that dynamically calculates ticket priority based on AI severity, duplicate counts, and time elapsed.
* **Tech Stack:** Node.js, Express.js, PostgreSQL, PostGIS, Multer (File Handling).

---

# Slide 5: Member 4 - Authority Dashboard
**Title:** Command Center & Analytics
**Role:** Dashboard & Data Visualization Developer

* **Command Center UI:** Built the advanced, real-time dashboard for city authorities to manage and triage incoming tickets.
* **Geospatial Hotspots:** Integrated interactive mapping (React Leaflet) to visually display issue clusters and geographic hotspots.
* **Data Analytics:** Developed dynamic charts (Recharts) and high-level summary statistics to track city-wide resolution progress.
* **Priority Inbox:** Designed the modern triage table with color-coded badges and progress bars for efficient status management.
* **Tech Stack:** React, Tailwind CSS, Recharts, React-Leaflet, Lucide Icons.
