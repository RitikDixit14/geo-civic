-- Seed Users
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@city.gov', '$2b$10$X8/A6zJ1Y1Y1Y1Y1Y1Y1Y.A6zJ1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1', 'admin'),
('Authority 1', 'auth1@city.gov', '$2b$10$X8/A6zJ1Y1Y1Y1Y1Y1Y1Y.A6zJ1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1', 'authority'),
('John Doe', 'john@example.com', '$2b$10$X8/A6zJ1Y1Y1Y1Y1Y1Y1Y.A6zJ1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1', 'citizen');

-- Seed Departments
INSERT INTO departments (name) VALUES
('Roads & Transport'),
('Electricity & Lighting'),
('Sanitation & Waste'),
('Water Supply & Maintenance');

-- Seed Reports (with ST_SetSRID for geometry)
INSERT INTO reports (citizen_id, image_url, description, category, severity, severity_score, latitude, longitude, location, status, created_at) VALUES
(3, '/uploads/seed_pothole.jpg', 'Large pothole on main road', 'pothole', 'High', 75, 19.0760, 72.8777, ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), 'Open', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, '/uploads/seed_streetlight.jpg', 'Streetlight is broken and not working', 'streetlight', 'Medium', 50, 19.0765, 72.8780, ST_SetSRID(ST_MakePoint(72.8780, 19.0765), 4326), 'In Progress', CURRENT_TIMESTAMP - INTERVAL '1 days'),
(3, '/uploads/seed_garbage.jpg', 'Garbage overflowing near market', 'garbage', 'High', 70, 19.0770, 72.8785, ST_SetSRID(ST_MakePoint(72.8785, 19.0770), 4326), 'Resolved', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(3, '/uploads/seed_water.jpg', 'Water pipe leakage causing water on road', 'water_leakage', 'Critical', 95, 19.0750, 72.8770, ST_SetSRID(ST_MakePoint(72.8770, 19.0750), 4326), 'Open', CURRENT_TIMESTAMP);

-- Update resolved_at for resolved report
UPDATE reports SET resolved_at = CURRENT_TIMESTAMP WHERE status = 'Resolved';

-- Seed Tickets
INSERT INTO tickets (report_id, category, severity, priority_score, status, assigned_department, created_at) VALUES
(1, 'pothole', 'High', 85.5, 'Open', 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 'streetlight', 'Medium', 55.0, 'In Progress', 2, CURRENT_TIMESTAMP - INTERVAL '1 days'),
(3, 'garbage', 'High', 70.0, 'Resolved', 3, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(4, 'water_leakage', 'Critical', 95.0, 'Open', 4, CURRENT_TIMESTAMP);

UPDATE tickets SET resolved_at = CURRENT_TIMESTAMP WHERE status = 'Resolved';
