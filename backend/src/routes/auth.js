// MEMBER 3 — BACKEND
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
            [name, email, hash]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Registration failed', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // HACKATHON DEMO BACKDOOR: Default Admin Login
        if (email === 'admin@admin.com' && password === 'admin') {
            const token = jwt.sign({ id: 999, role: 'admin' }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1d' });
            return res.json({ success: true, token, user: { id: 999, name: 'Demo Admin', role: 'admin' } });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Login error', error: err.message });
    }
});

module.exports = router;
