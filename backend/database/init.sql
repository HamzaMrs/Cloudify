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

-- Table pour stocker les contenus absurdes générés
CREATE TABLE IF NOT EXISTS silly_contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion de données de test
INSERT INTO users (username, password) VALUES ('test_user', 'password123');
INSERT INTO silly_contents (content, user_id) VALUES ('Un chat qui code en Python', 1);