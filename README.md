# ☁️ Cloudify - Silly as a Service

> Location de nuages à la demande. Parce que pourquoi pas ?

## 🚀 Lancement du projet

```bash
# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/Cloudify.git
cd Cloudify

# Lancer toute la stack
docker-compose up --build -d

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
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter |

### Métier (Business API - port 5000)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/clouds` | Liste des nuages disponibles |
| POST | `/clouds/rent` | Louer un nuage |
| GET | `/rentals/:userId` | Mes locations |
