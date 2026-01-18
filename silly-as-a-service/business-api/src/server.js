const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Liste de villes pour la météo réelle
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
