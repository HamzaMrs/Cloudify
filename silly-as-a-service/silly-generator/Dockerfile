FROM python:3.9-slim

WORKDIR /app

# Copie du fichier requirements.txt (il est à la racine, pas dans src/)
COPY requirements.txt ./

# Installation des dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY src/ ./

# Exposition du port
EXPOSE 5000

# Exécution de l'application
CMD ["python", "app.py"]