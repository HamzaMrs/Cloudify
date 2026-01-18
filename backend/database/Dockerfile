FROM mysql:8.0

# Copie du script d'initialisation
COPY init.sql /docker-entrypoint-initdb.d/

# Les variables d'environnement sont définies dans docker-compose.yml
# MYSQL_ROOT_PASSWORD, MYSQL_DATABASE

EXPOSE 3306