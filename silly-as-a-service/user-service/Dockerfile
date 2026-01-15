FROM golang:1.18

WORKDIR /app

# Copie des fichiers de dépendances ET du code source
COPY go.mod ./
COPY src/ ./

# Force Go à scanner le code et télécharger les dépendances manquantes (driver MySQL)
RUN go mod tidy

# Téléchargement des dépendances
RUN go mod download

# Compilation
RUN go build -o main ./main.go

# Exposition du port
EXPOSE 8080

# Exécution
CMD ["./main"]