# ☁️ Cloudify - Silly as a Service

> Location de nuages à la demande.

## 🚀 Lancement du projet

```bash
# Cloner le repository
git clone https://github.com/HamzaMrs/Cloudify.git
cd Cloudify

# Copier les variables d'environnement
cp .env.example .env

# Lancer toute la stack
docker compose up --build -d

# Accéder à l'application
# Frontend : http://localhost
```

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│ API Gateway │────▶│ Business API│────▶│   MySQL     │
│  (React)    │     │  (Auth/JWT) │     │  (Métier)   │     │ (Database)  │
│  Port: 80   │     │  Port: 3000 │     │  Port: 5000 │     │  Port: 3306 │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## 📡 Endpoints API

### Auth (API Gateway - port 3000)
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/auth/register` | Créer un compte | Non |
| POST | `/auth/login` | Se connecter | Non |
| POST | `/auth/logout` | Se déconnecter | Oui |
| GET | `/auth/me` | Infos utilisateur connecté | Oui |
| GET | `/auth/my-clouds` | Mes locations | Oui |

### Nuages (via API Gateway - port 3000)
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/clouds` | Liste des nuages | Non |
| GET | `/api/clouds/nearby` | Nuages à proximité | Non |
| GET | `/api/clouds/:id` | Détail d'un nuage | Non |
| POST | `/api/clouds/:id/rent` | Louer un nuage | Oui |
| POST | `/api/clouds/:id/release` | Libérer un nuage | Oui |

### Utilitaires
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/health` | État du service |
| GET | `/generate` | Générer des nuages (démo) |
