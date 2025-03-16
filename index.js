require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const otpCode = "123456";

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// User Signup
app.post('/signup', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('SELECT * FROM users WHERE phone = ?', [phone], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
            [name, email, phone, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Error creating user' });
                res.status(201).json({ message: 'User registered successfully' });
            });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    db.query('SELECT * FROM users WHERE phone = ?', [phone], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (otp === otpCode) {
        res.json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

// Search User by Phone
app.get("/search", (req, res) => {
    let phone = req.query.phone;
    if (!phone) {
        return res.json({ error: "Phone number is required" });
    }

    // Extract last 10 digits for search
    let lastTenDigits = phone.slice(-10);

    // SQL Query to match full or last 10 digits
    let query = `SELECT name, phone, email FROM users WHERE phone LIKE ?`;
    let values = [`%${lastTenDigits}`];  // This allows searching by last 10 digits

    db.query(query, values, (err, results) => {
        if (err) {
            return res.json({ error: "Database error" });
        }

        if (results.length > 0) {
            res.json(results[0]); // Return the first matched result
        } else {
            res.json({ error: "No records found" });
        }
    });
});

// Mark as Spam
app.post('/mark-spam', (req, res) => {
    const { phone } = req.body;
    db.query('INSERT INTO spam_numbers (phone) VALUES (?)', [phone], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Number marked as spam' });
    });
});

// Get Spam Numbers
app.get('/spam-list', (req, res) => {
    db.query('SELECT phone, COUNT(phone) AS spam_count FROM spam_numbers GROUP BY phone', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Block Number
app.post('/block-number', (req, res) => {
    const { user_id, phone } = req.body;
    db.query('INSERT INTO blocked_numbers (user_id, phone) VALUES (?, ?)', [user_id, phone], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Number blocked successfully' });
    });
});

// Fetch Blocked Numbers
app.get('/blocked-list', (req, res) => {
    const { user_id } = req.query;
    db.query('SELECT phone FROM blocked_numbers WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Update User Profile
app.put('/update-profile', (req, res) => {
    const { id, name, email } = req.body;
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Profile updated successfully' });
    });
});

// Delete User
app.delete('/delete-user', (req, res) => {
    const { phone } = req.body;
    db.query('DELETE FROM users WHERE phone = ?', [phone], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'User deleted successfully' });
    });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));
