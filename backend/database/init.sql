-- Création de la base de données et des tables nécessaires pour le service "Silly as a Service"
-- La base de données 'silly_db' est créée automatiquement via MYSQL_DATABASE dans docker-compose

USE silly_db;

-- Table pour stocker les utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE CLOUDS : Nuages disponibles à la location
-- ============================================
CREATE TABLE IF NOT EXISTS clouds (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size_km2 INT NOT NULL,
    density INT NOT NULL,
    altitude_m INT NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    price_per_hour DECIMAL(6,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE RENTALS : Locations de nuages
-- ============================================
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cloud_id VARCHAR(36) NOT NULL,
    user_id INT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    total_price DECIMAL(10,2),
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (cloud_id) REFERENCES clouds(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- SEED DATA : Nuages pré-générés dans le monde
-- ============================================
INSERT INTO clouds (id, name, type, size_km2, density, altitude_m, latitude, longitude, price_per_hour, is_available) VALUES
-- Europe
('cloud_0001', 'Cumulonimbus Alpha', 'storm', 220, 95, 3200, 48.8566, 2.3522, 59.99, TRUE),
('cloud_0002', 'Stratus Parisien', 'fog', 85, 72, 600, 48.9200, 2.4100, 24.99, TRUE),
('cloud_0003', 'Cirrus Élégant', 'wispy', 150, 45, 8500, 49.1000, 2.1000, 19.99, TRUE),
('cloud_0004', 'Nimbus London', 'rain', 180, 88, 1200, 51.5074, -0.1278, 44.99, TRUE),
('cloud_0005', 'Cumulus Westminster', 'fluffy', 95, 65, 1800, 51.4995, -0.1248, 29.99, TRUE),
('cloud_0006', 'Stratus Berlin', 'fog', 120, 78, 800, 52.5200, 13.4050, 34.99, TRUE),
('cloud_0007', 'Altostratus Roma', 'layered', 200, 60, 4000, 41.9028, 12.4964, 39.99, TRUE),
('cloud_0008', 'Cumulonimbus Madrid', 'storm', 250, 92, 2800, 40.4168, -3.7038, 54.99, TRUE),

-- Amérique du Nord
('cloud_0009', 'Supercell NYC', 'storm', 300, 98, 4500, 40.7128, -74.0060, 79.99, TRUE),
('cloud_0010', 'Fog San Francisco', 'fog', 180, 85, 200, 37.7749, -122.4194, 49.99, TRUE),
('cloud_0011', 'Cumulus California', 'fluffy', 110, 55, 2200, 34.0522, -118.2437, 32.99, TRUE),
('cloud_0012', 'Storm Chicago', 'storm', 280, 90, 3000, 41.8781, -87.6298, 64.99, TRUE),
('cloud_0013', 'Aurora Toronto', 'special', 160, 40, 10000, 43.6532, -79.3832, 89.99, TRUE),

-- Asie
('cloud_0014', 'Monsoon Tokyo', 'rain', 350, 94, 2000, 35.6762, 139.6503, 69.99, TRUE),
('cloud_0015', 'Cumulus Fujisan', 'fluffy', 80, 50, 3500, 35.3606, 138.7274, 44.99, TRUE),
('cloud_0016', 'Stratus Singapore', 'fog', 90, 82, 400, 1.3521, 103.8198, 29.99, TRUE),
('cloud_0017', 'Nimbus Mumbai', 'rain', 400, 96, 1500, 19.0760, 72.8777, 74.99, TRUE),
('cloud_0018', 'Cirrus Beijing', 'wispy', 200, 35, 9000, 39.9042, 116.4074, 24.99, TRUE),
('cloud_0019', 'Storm Shanghai', 'storm', 320, 91, 2600, 31.2304, 121.4737, 59.99, TRUE),

-- Océanie
('cloud_0020', 'Cumulus Sydney', 'fluffy', 130, 58, 2100, -33.8688, 151.2093, 34.99, TRUE),
('cloud_0021', 'Rain Melbourne', 'rain', 170, 80, 1100, -37.8136, 144.9631, 42.99, TRUE),

-- Afrique
('cloud_0022', 'Desert Cloud Cairo', 'rare', 60, 25, 5000, 30.0444, 31.2357, 99.99, TRUE),
('cloud_0023', 'Tropical Cape Town', 'fluffy', 140, 62, 1900, -33.9249, 18.4241, 38.99, TRUE),

-- Amérique du Sud  
('cloud_0024', 'Amazon Nimbus', 'rain', 500, 99, 1800, -3.4653, -62.2159, 84.99, TRUE),
('cloud_0025', 'Andes Cirrus', 'wispy', 180, 30, 12000, -13.1631, -72.5450, 29.99, TRUE),
('cloud_0026', 'Rio Cumulus', 'fluffy', 100, 55, 2000, -22.9068, -43.1729, 32.99, TRUE);

-- Aucun utilisateur par défaut : les utilisateurs doivent créer leur compte