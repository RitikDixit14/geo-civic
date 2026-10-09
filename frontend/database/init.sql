CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    citizen_id INTEGER REFERENCES users(id),
    image_url VARCHAR(512),
    image_hash VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    severity VARCHAR(50),
    severity_score INTEGER,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOMETRY(Point, 4326),
    status VARCHAR(50) DEFAULT 'Open',
    duplicate_of INTEGER REFERENCES reports(id),
    duplicate_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id),
    category VARCHAR(100),
    severity VARCHAR(50),
    priority_score DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Open',
    assigned_department INTEGER REFERENCES departments(id),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issue_images (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id),
    image_url VARCHAR(512),
    image_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
