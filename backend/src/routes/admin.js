// MEMBER 3 — BACKEND
const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/reports', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.id as ticket_id, t.category, t.severity, t.priority_score, t.status, t.assigned_department, t.created_at, r.latitude, r.longitude, r.image_url, r.description, r.duplicate_count
            FROM tickets t
            JOIN reports r ON t.report_id = r.id
            ORDER BY t.priority_score DESC
        `);
        res.json({ success: true, tickets: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
    }
});

router.patch('/reports/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        // update ticket status
        await pool.query('UPDATE tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, req.params.id]);
        
        // if resolved, set resolved_at
        if (status === 'Resolved') {
            await pool.query('UPDATE tickets SET resolved_at = CURRENT_TIMESTAMP WHERE id = $1', [req.params.id]);
        }
        
        // update parent report status
        const ticketResult = await pool.query('SELECT report_id FROM tickets WHERE id = $1', [req.params.id]);
        if (ticketResult.rows.length > 0) {
            const reportId = ticketResult.rows[0].report_id;
            await pool.query('UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [status, reportId]);
            if (status === 'Resolved') {
                await pool.query('UPDATE reports SET resolved_at = CURRENT_TIMESTAMP WHERE id = $1', [reportId]);
            }
        }
        
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
});

router.patch('/reports/:id/assign', async (req, res) => {
    try {
        const { department_id } = req.body;
        await pool.query('UPDATE tickets SET assigned_department = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [department_id, req.params.id]);
        res.json({ success: true, message: 'Department assigned' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to assign' });
    }
});

module.exports = router;
