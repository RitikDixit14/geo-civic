// MEMBER 3 — BACKEND
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { analyzeImage } = require('../services/aiService');
const { calculatePriority } = require('../utils/priority');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { description } = req.body;
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

        const image_url = '/uploads/' + req.file.filename;

        // 1. Send to AI
        const aiResult = await analyzeImage(req.file.path, description, latitude, longitude);
        
        // HACKATHON DEMO: Ensure user 999 exists so foreign key doesn't fail
        if (req.user && req.user.id === 999) {
            await pool.query(`INSERT INTO users (id, name, email, password_hash, role) VALUES (999, 'Demo Admin', 'admin@admin.com', 'demo', 'admin') ON CONFLICT (id) DO NOTHING`);
        }
        
        // 2. Duplicate Check using PostGIS
        // ~50m radius check
        const dupCheck = await pool.query(`
            SELECT id, image_hash, duplicate_count, created_at, category, severity_score, ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as dist
            FROM reports
            WHERE category = $3
            AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 50)
            ORDER BY dist ASC LIMIT 1
        `, [longitude, latitude, aiResult.category]);

        let is_duplicate = false;
        let existing_ticket_id = null;
        let new_report_id = null;
        let finalPriority = 0;

        if (dupCheck.rows.length > 0) {
            is_duplicate = true;
            const parent = dupCheck.rows[0];
            existing_ticket_id = parent.id;

            // Increment duplicate_count
            const updatedDupCount = parent.duplicate_count + 1;
            await pool.query('UPDATE reports SET duplicate_count = $1 WHERE id = $2', [updatedDupCount, parent.id]);

            // Save new report associated with parent
            const reportResult = await pool.query(
                `INSERT INTO reports (citizen_id, image_url, image_hash, description, category, severity, severity_score, latitude, longitude, location, duplicate_of)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ST_SetSRID(ST_MakePoint($10, $11), 4326), $12) RETURNING id`,
                [req.user.id, image_url, aiResult.image_hash, description, aiResult.category, aiResult.severity, aiResult.severity_score, latitude, longitude, longitude, latitude, parent.id]
            );
            new_report_id = reportResult.rows[0].id;

            // Recalculate priority
            finalPriority = calculatePriority(parent.severity_score, updatedDupCount, parent.created_at);
            await pool.query('UPDATE tickets SET priority_score = $1 WHERE report_id = $2', [finalPriority, parent.id]);
        } else {
            // New Report
            const reportResult = await pool.query(
                `INSERT INTO reports (citizen_id, image_url, image_hash, description, category, severity, severity_score, latitude, longitude, location)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ST_SetSRID(ST_MakePoint($10, $11), 4326)) RETURNING id, created_at`,
                [req.user.id, image_url, aiResult.image_hash, description, aiResult.category, aiResult.severity, aiResult.severity_score, latitude, longitude, longitude, latitude]
            );
            new_report_id = reportResult.rows[0].id;
            
            finalPriority = calculatePriority(aiResult.severity_score, 0, reportResult.rows[0].created_at);

            await pool.query(
                `INSERT INTO tickets (report_id, category, severity, priority_score) VALUES ($1, $2, $3, $4)`,
                [new_report_id, aiResult.category, aiResult.severity, finalPriority]
            );
        }

        res.json({
            success: true,
            report: {
                id: new_report_id,
                ticket_id: existing_ticket_id || new_report_id,
                category: aiResult.category,
                severity: aiResult.severity,
                severity_score: aiResult.severity_score,
                priority_score: finalPriority,
                status: 'Open',
                is_duplicate,
                ai_mode: aiResult.mode,
                confidence: aiResult.confidence
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Report creation failed', error: err.message });
    }
});

router.get('/my', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reports WHERE citizen_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json({ success: true, reports: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reports WHERE id = $1 AND citizen_id = $2', [req.params.id, req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, report: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch report' });
    }
});

module.exports = router;
