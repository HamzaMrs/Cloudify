const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Variables d'environnement depuis docker-compose.yml
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8080';
const SILLY_SERVICE_URL = process.env.SILLY_SERVICE_URL || 'http://silly-generator:5000';

app.use(cors());
app.use(bodyParser.json());

// Route de santé
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'api-gateway' });
});

// Proxy vers silly-generator
app.post('/generate', async (req, res) => {
    try {
        const response = await axios.post(`${SILLY_SERVICE_URL}/generate`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling silly-generator:', error.message);
        res.status(500).json({ error: 'Error generating silly content' });
    }
});

app.get('/generate', async (req, res) => {
    try {
        const response = await axios.get(`${SILLY_SERVICE_URL}/generate`);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling silly-generator:', error.message);
        res.status(500).json({ error: 'Error generating silly content' });
    }
});

// Proxy vers user-service
app.post('/users', async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/users`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling user-service:', error.message);
        res.status(500).json({ error: 'Error processing user request' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/register`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling user-service register:', error.message);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/login`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling user-service login:', error.message);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Gateway is running on port ${PORT}`);
    console.log(`USER_SERVICE_URL: ${USER_SERVICE_URL}`);
    console.log(`SILLY_SERVICE_URL: ${SILLY_SERVICE_URL}`);
});