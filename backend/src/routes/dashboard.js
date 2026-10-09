// MEMBER 3 — BACKEND
const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
                SUM(CASE WHEN priority_score >= 70 THEN 1 ELSE 0 END) as high_critical
            FROM tickets
        `);
        res.json({ success: true, stats: stats.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

router.get('/category-counts', async (req, res) => {
    try {
        const counts = await pool.query(`
            SELECT category, COUNT(*) as count
            FROM tickets
            GROUP BY category
        `);
        res.json({ success: true, counts: counts.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch category counts' });
    }
});

router.get('/priority-reports', async (req, res) => {
    try {
        const reports = await pool.query(`
            SELECT id as ticket_id, category, severity, priority_score, status, assigned_department, created_at
            FROM tickets
            ORDER BY priority_score DESC
            LIMIT 10
        `);
        res.json({ success: true, reports: reports.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch priority reports' });
    }
});

router.get('/map-data', async (req, res) => {
    try {
        const data = await pool.query(`
            SELECT t.id as ticket_id, t.category, t.severity, t.priority_score, t.status, r.latitude, r.longitude
            FROM tickets t
            JOIN reports r ON t.report_id = r.id
            WHERE r.latitude IS NOT NULL AND r.longitude IS NOT NULL
        `);
        res.json({ success: true, data: data.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch map data' });
    }
});

router.get('/resolution-analytics', async (req, res) => {
    try {
        const data = await pool.query(`
            SELECT 
                COUNT(*) as resolved_total,
                AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours
            FROM tickets
            WHERE status = 'Resolved' AND resolved_at IS NOT NULL
        `);
        res.json({ success: true, data: data.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch resolution analytics' });
    }
});

module.exports = router;
