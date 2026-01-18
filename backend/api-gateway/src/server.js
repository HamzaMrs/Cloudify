const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Variables d'environnement
const BUSINESS_SERVICE_URL = process.env.BUSINESS_SERVICE_URL || 'http://business-api:5000';
const DB_HOST = process.env.DB_HOST || 'database';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'silly_db';

app.use(cors());
app.use(bodyParser.json());

// Connexion MySQL
const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
};

// Route de santé
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'api-gateway' });
});

// Proxy vers business-api (Node.js)
app.get('/generate', async (req, res) => {
    try {
        const response = await axios.get(`${BUSINESS_SERVICE_URL}/generate`);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling business-api:', error.message);
        res.status(500).json({ error: 'Error generating cloud content' });
    }
});

// Authentication (Direct MySQL via Express)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        await connection.end();
        res.status(201).json({ id: rows.insertId, username });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        await connection.end();

        if (rows.length > 0) {
            res.json({ message: 'Login successful', user: { id: rows[0].id, username: rows[0].username } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login process failed' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Gateway is running on port ${PORT}`);
});