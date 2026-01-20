const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Variables d'environnement
const BUSINESS_SERVICE_URL = process.env.BUSINESS_SERVICE_URL || 'http://business-api:5000';
const DB_HOST = process.env.DB_HOST || 'database';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'silly_db';
const JWT_SECRET = process.env.JWT_SECRET || 'cloudify-secret-key-2026';

app.use(cors());
app.use(bodyParser.json());

// Connexion MySQL
const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
};

// Liste des tokens invalidés (logout)
const blacklistedTokens = new Set();

// ============================================
// MIDDLEWARE : Vérification JWT
// ============================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token d\'authentification requis' });
    }

    // Vérifier si le token est blacklisté (déconnecté)
    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ error: 'Session expirée, veuillez vous reconnecter' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }
        req.user = user;
        req.token = token;
        next();
    });
};

// Middleware optionnel (pour les routes publiques qui peuvent avoir un user)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token && !blacklistedTokens.has(token)) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
};

// Route de santé
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'api-gateway' });
});

// ============================================
// AUTH ROUTES
// ============================================

// POST /auth/register - Créer un compte
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }
    
    if (username.length < 3) {
        return res.status(400).json({ error: 'Le nom d\'utilisateur doit faire au moins 3 caractères' });
    }
    
    if (password.length < 4) {
        return res.status(400).json({ error: 'Le mot de passe doit faire au moins 4 caractères' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await connection.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        await connection.end();
        
        const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({ 
            status: 'success',
            message: 'Compte créé avec succès',
            user: { id: result.insertId, username, clouds_owned: 0 },
            token 
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
        }
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// POST /auth/login - Se connecter
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            await connection.end();
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const user = users[0];
        
        // Vérifier le mot de passe (supporte les anciens mots de passe non hashés)
        let validPassword = false;
        if (user.password.startsWith('$2')) {
            // Mot de passe hashé avec bcrypt
            validPassword = await bcrypt.compare(password, user.password);
        } else {
            // Ancien mot de passe en clair (pour migration)
            validPassword = (password === user.password);
        }

        if (!validPassword) {
            await connection.end();
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        // Compter les nuages loués par cet utilisateur
        const [rentals] = await connection.execute(
            `SELECT COUNT(*) as count FROM rentals WHERE user_id = ? AND status = 'active'`,
            [user.id]
        );
        await connection.end();

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ 
            status: 'success',
            message: 'Connexion réussie',
            user: { 
                id: user.id, 
                username: user.username,
                clouds_owned: rentals[0].count
            },
            token 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur de connexion' });
    }
});

// POST /auth/logout - Se déconnecter
app.post('/auth/logout', authenticateToken, (req, res) => {
    // Ajouter le token à la blacklist
    blacklistedTokens.add(req.token);
    
    res.json({ 
        status: 'success',
        message: 'Déconnexion réussie' 
    });
});

// GET /auth/me - Obtenir le profil de l'utilisateur connecté
app.get('/auth/me', authenticateToken, async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Récupérer les infos utilisateur
        const [users] = await connection.execute(
            'SELECT id, username, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Compter les nuages loués
        const [rentals] = await connection.execute(
            `SELECT COUNT(*) as count FROM rentals WHERE user_id = ? AND status = 'active'`,
            [req.user.id]
        );

        await connection.end();

        res.json({
            status: 'success',
            user: {
                id: users[0].id,
                username: users[0].username,
                created_at: users[0].created_at,
                clouds_owned: rentals[0].count
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /auth/my-clouds - Obtenir les nuages loués par l'utilisateur
app.get('/auth/my-clouds', authenticateToken, async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        const [clouds] = await connection.execute(
            `SELECT c.*, r.start_time, r.end_time, r.total_price, r.id as rental_id
             FROM clouds c 
             INNER JOIN rentals r ON c.id = r.cloud_id 
             WHERE r.user_id = ? AND r.status = 'active'
             ORDER BY r.start_time DESC`,
            [req.user.id]
        );

        await connection.end();

        const formattedClouds = clouds.map(cloud => ({
            id: cloud.id,
            name: cloud.name,
            type: cloud.type,
            size_km2: cloud.size_km2,
            density: cloud.density,
            altitude_m: cloud.altitude_m,
            location: {
                lat: parseFloat(cloud.latitude),
                lng: parseFloat(cloud.longitude)
            },
            price_per_hour: parseFloat(cloud.price_per_hour),
            rental: {
                rental_id: cloud.rental_id,
                start_time: cloud.start_time,
                end_time: cloud.end_time,
                total_price: parseFloat(cloud.total_price)
            }
        }));

        res.json({
            status: 'success',
            count: formattedClouds.length,
            clouds: formattedClouds
        });
    } catch (error) {
        console.error('My clouds error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ============================================
// LEGACY AUTH ROUTES (Compatibilité)
// ============================================
app.post('/register', async (req, res) => {
    req.url = '/auth/register';
    return app._router.handle(req, res);
});

app.post('/login', async (req, res) => {
    req.url = '/auth/login';
    return app._router.handle(req, res);
});

// ============================================
// CLOUD API ROUTES (Proxy vers Business API)
// ============================================

// GET /api/clouds/nearby - Nuages à proximité (ENDPOINT PRINCIPAL)
app.get('/api/clouds/nearby', async (req, res) => {
    try {
        const response = await axios.get(`${BUSINESS_SERVICE_URL}/clouds/nearby`, {
            params: req.query
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling business-api /clouds/nearby:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ status: 'error', message: 'Service indisponible' });
        }
    }
});

// GET /api/clouds - Liste de tous les nuages
app.get('/api/clouds', async (req, res) => {
    try {
        const response = await axios.get(`${BUSINESS_SERVICE_URL}/clouds`);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling business-api /clouds:', error.message);
        res.status(500).json({ status: 'error', message: 'Service indisponible' });
    }
});

// GET /api/clouds/:id - Détail d'un nuage
app.get('/api/clouds/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BUSINESS_SERVICE_URL}/clouds/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling business-api:', error.message);
        if (error.response && error.response.status === 404) {
            res.status(404).json({ status: 'error', message: 'Nuage non trouvé' });
        } else {
            res.status(500).json({ status: 'error', message: 'Service indisponible' });
        }
    }
});

// POST /api/clouds/:id/rent - Louer un nuage (AUTH REQUIRED)
app.post('/api/clouds/:id/rent', authenticateToken, async (req, res) => {
    try {
        const response = await axios.post(`${BUSINESS_SERVICE_URL}/clouds/${req.params.id}/rent`, {
            user_id: req.user.id,
            duration_hours: req.body.duration_hours || 1
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error renting cloud:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ status: 'error', message: 'Erreur lors de la location' });
        }
    }
});

// POST /api/clouds/:id/release - Libérer un nuage (AUTH REQUIRED)
app.post('/api/clouds/:id/release', authenticateToken, async (req, res) => {
    try {
        const response = await axios.post(`${BUSINESS_SERVICE_URL}/clouds/${req.params.id}/release`);
        res.json(response.data);
    } catch (error) {
        console.error('Error releasing cloud:', error.message);
        res.status(500).json({ status: 'error', message: 'Erreur lors de la libération' });
    }
});

// ============================================
// LEGACY ROUTES (Compatibilité)
// ============================================
app.get('/generate', async (req, res) => {
    try {
        const response = await axios.get(`${BUSINESS_SERVICE_URL}/generate`);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling business-api:', error.message);
        res.status(500).json({ error: 'Error generating cloud content' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Gateway is running on port ${PORT}`);
});