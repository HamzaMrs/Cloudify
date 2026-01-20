const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Config MySQL
const DB_HOST = process.env.DB_HOST || 'database';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'example';
const DB_NAME = process.env.DB_NAME || 'silly_db';

const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
};

app.use(cors());
app.use(express.json());

// ============================================
// CONFIG : Seuils pour "gros nuages"
// ============================================
const DEFAULT_MIN_SIZE = 80;      // km²
const DEFAULT_MIN_DENSITY = 70;   // %
const DEFAULT_RADIUS = 50;        // km
const DEFAULT_LIMIT = 10;

// ============================================
// UTILS : Calcul de distance (Haversine)
// ============================================
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// ============================================
// ENDPOINT PRINCIPAL : GET /clouds/nearby
// ============================================
app.get('/clouds/nearby', async (req, res) => {
    const { lat, lng, radius, minSize, minDensity, limit } = req.query;

    // Validation des paramètres obligatoires
    if (!lat || !lng) {
        return res.status(400).json({
            status: 'error',
            message: 'Les paramètres lat et lng sont obligatoires'
        });
    }

    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const searchRadius = parseInt(radius) || DEFAULT_RADIUS;
    const minSizeFilter = parseInt(minSize) || DEFAULT_MIN_SIZE;
    const minDensityFilter = parseInt(minDensity) || DEFAULT_MIN_DENSITY;
    const resultLimit = parseInt(limit) || DEFAULT_LIMIT;

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Récupérer tous les nuages disponibles qui correspondent aux critères de taille/densité
        const [clouds] = await connection.execute(
            `SELECT * FROM clouds 
             WHERE is_available = TRUE 
             AND size_km2 >= ? 
             AND density >= ?`,
            [minSizeFilter, minDensityFilter]
        );
        
        await connection.end();

        // Filtrer par distance et calculer la distance pour chaque nuage
        const nearbyClouds = clouds
            .map(cloud => {
                const distance = calculateDistance(
                    centerLat, centerLng,
                    parseFloat(cloud.latitude), parseFloat(cloud.longitude)
                );
                return {
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
                    distance_km: Math.round(distance * 10) / 10,
                    price_per_hour: parseFloat(cloud.price_per_hour),
                    availability: cloud.is_available ? 'available' : 'rented'
                };
            })
            .filter(cloud => cloud.distance_km <= searchRadius)
            .sort((a, b) => a.distance_km - b.distance_km)
            .slice(0, resultLimit);

        res.json({
            status: 'success',
            meta: {
                center: { lat: centerLat, lng: centerLng },
                radius_km: searchRadius,
                filters: { minSize: minSizeFilter, minDensity: minDensityFilter },
                count: nearbyClouds.length
            },
            clouds: nearbyClouds
        });

    } catch (error) {
        console.error('Error fetching nearby clouds:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la recherche de nuages'
        });
    }
});

// ============================================
// ENDPOINT : GET /clouds (tous les nuages)
// ============================================
app.get('/clouds', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [clouds] = await connection.execute('SELECT * FROM clouds WHERE is_available = TRUE');
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
            availability: cloud.is_available ? 'available' : 'rented'
        }));

        res.json({ status: 'success', count: formattedClouds.length, clouds: formattedClouds });
    } catch (error) {
        console.error('Error fetching clouds:', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des nuages' });
    }
});

// ============================================
// ENDPOINT : GET /clouds/:id (détail d'un nuage)
// ============================================
app.get('/clouds/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [clouds] = await connection.execute('SELECT * FROM clouds WHERE id = ?', [id]);
        await connection.end();

        if (clouds.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Nuage non trouvé' });
        }

        const cloud = clouds[0];
        res.json({
            status: 'success',
            cloud: {
                id: cloud.id,
                name: cloud.name,
                type: cloud.type,
                size_km2: cloud.size_km2,
                density: cloud.density,
                altitude_m: cloud.altitude_m,
                location: { lat: parseFloat(cloud.latitude), lng: parseFloat(cloud.longitude) },
                price_per_hour: parseFloat(cloud.price_per_hour),
                availability: cloud.is_available ? 'available' : 'rented'
            }
        });
    } catch (error) {
        console.error('Error fetching cloud:', error);
        res.status(500).json({ status: 'error', message: 'Erreur serveur' });
    }
});

// ============================================
// ENDPOINT : POST /clouds/:id/rent (louer un nuage)
// ============================================
app.post('/clouds/:id/rent', async (req, res) => {
    const { id } = req.params;
    const { user_id, duration_hours } = req.body;

    if (!user_id || !duration_hours) {
        return res.status(400).json({
            status: 'error',
            message: 'user_id et duration_hours sont requis'
        });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Vérifier si le nuage existe et est disponible
        const [clouds] = await connection.execute(
            'SELECT * FROM clouds WHERE id = ? AND is_available = TRUE',
            [id]
        );

        if (clouds.length === 0) {
            await connection.end();
            return res.status(404).json({
                status: 'error',
                message: 'Nuage non trouvé ou déjà loué'
            });
        }

        const cloud = clouds[0];
        const totalPrice = parseFloat(cloud.price_per_hour) * duration_hours;
        const endTime = new Date(Date.now() + duration_hours * 60 * 60 * 1000);

        // Créer la location
        const [result] = await connection.execute(
            `INSERT INTO rentals (cloud_id, user_id, end_time, total_price, status) 
             VALUES (?, ?, ?, ?, 'active')`,
            [id, user_id, endTime, totalPrice]
        );

        // Marquer le nuage comme non disponible
        await connection.execute(
            'UPDATE clouds SET is_available = FALSE WHERE id = ?',
            [id]
        );

        await connection.end();

        res.status(201).json({
            status: 'success',
            message: 'Nuage loué avec succès',
            rental: {
                rental_id: result.insertId,
                cloud_id: id,
                cloud_name: cloud.name,
                user_id: user_id,
                duration_hours: duration_hours,
                total_price: totalPrice,
                start_time: new Date().toISOString(),
                end_time: endTime.toISOString()
            }
        });

    } catch (error) {
        console.error('Error renting cloud:', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de la location' });
    }
});

// ============================================
// ENDPOINT : POST /clouds/:id/release (libérer un nuage)
// ============================================
app.post('/clouds/:id/release', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Terminer la location active
        await connection.execute(
            `UPDATE rentals SET status = 'completed', end_time = NOW() 
             WHERE cloud_id = ? AND status = 'active'`,
            [id]
        );

        // Remettre le nuage disponible
        await connection.execute(
            'UPDATE clouds SET is_available = TRUE WHERE id = ?',
            [id]
        );

        await connection.end();

        res.json({ status: 'success', message: 'Nuage libéré avec succès' });

    } catch (error) {
        console.error('Error releasing cloud:', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de la libération' });
    }
});

// ============================================
// LEGACY : Ancien endpoint /generate (compatibilité)
// ============================================
const CITIES = [
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Singapore", lat: 1.3521, lng: 103.8198 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Reykjavik", lat: 64.1466, lng: -21.9426 },
    { name: "Moscow", lat: 55.7558, lng: 37.6173 },
    { name: "Cape Town", lat: -33.9249, lng: 18.4241 }
];

function getCloudType(wmoCode) {
    if ([0, 1].includes(wmoCode)) return 'Cirrus';
    if ([2, 3, 45, 48].includes(wmoCode)) return 'Stratus';
    if ([51, 53, 55, 61, 63, 65].includes(wmoCode)) return 'Nimbostratus';
    if ([80, 81, 82].includes(wmoCode)) return 'Cumulus';
    if (wmoCode >= 95) return 'Cumulonimbus';
    return 'Altocumulus';
}

function getRandomCities(arr, n) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

app.get('/generate', async (req, res) => {
    const clouds = [];
    const selectedCities = getRandomCities(CITIES, 6);

    for (const city of selectedCities) {
        try {
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`;
            const response = await axios.get(weatherUrl, { timeout: 2000 });
            
            if (response.data && response.data.current_weather) {
                const weather = response.data.current_weather;
                const wmoCode = weather.weathercode || 0;
                const windSpeed = weather.windspeed || 0;
                const temp = weather.temperature || 0;
                const cloudType = getCloudType(wmoCode);

                const status = (windSpeed < 50 && wmoCode <= 60) ? 'Active' : 'Maintenance';

                clouds.push({
                    id: uuidv4(),
                    name: `Unit-${city.name.toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
                    type: cloudType,
                    lat: city.lat + (Math.random() * 0.2 - 0.1),
                    lng: city.lng + (Math.random() * 0.2 - 0.1),
                    humidity: wmoCode < 50 ? Math.floor(Math.random() * 60) + 30 : Math.floor(Math.random() * 20) + 80,
                    windSpeed: windSpeed,
                    temperature: temp,
                    area: Number((Math.random() * 12.5 + 2.5).toFixed(2)),
                    status: status,
                    rentedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    ownerId: "system",
                    creditsPerHour: Number((100 + windSpeed * 10).toFixed(2))
                });
            }
        } catch (error) {
            console.error(`Error fetching weather for ${city.name}:`, error.message);
            // Fallback
             clouds.push({
                id: uuidv4(),
                name: `Backup-${city.name}`,
                type: 'Stratus',
                lat: city.lat,
                lng: city.lng,
                humidity: 50,
                windSpeed: 10,
                area: 5.0,
                status: 'Maintenance',
                rentedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                ownerId: 'system',
                creditsPerHour: 150.00
            });
        }
    }

    res.json(clouds);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'business-api' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Business API running on port ${PORT}`);
});
