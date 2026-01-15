package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"

    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    ID       int    `json:"id"`
    Username string `json:"username"`
    Password string `json:"password"`
}

var db *sql.DB

func main() {
    // Connexion à MySQL depuis les variables d'environnement
    dbHost := os.Getenv("DB_HOST")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")

    dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", dbUser, dbPassword, dbHost, dbName)
    
    var err error
    
    // Retry logic : attendre que MySQL soit prêt
    maxRetries := 10
    for i := 0; i < maxRetries; i++ {
        db, err = sql.Open("mysql", dsn)
        if err != nil {
            log.Printf("Attempt %d: Error connecting to database: %v", i+1, err)
            time.Sleep(3 * time.Second)
            continue
        }
        
        // Test de connexion
        if err = db.Ping(); err != nil {
            log.Printf("Attempt %d: Error pinging database: %v", i+1, err)
            time.Sleep(3 * time.Second)
            continue
        }
        
        log.Println("Successfully connected to MySQL database!")
        break
    }
    
    if err != nil {
        log.Fatal("Failed to connect to database after retries:", err)
    }
    defer db.Close()

    http.HandleFunc("/health", healthCheck)
    http.HandleFunc("/register", registerUser)
    http.HandleFunc("/login", loginUser)
    http.HandleFunc("/users", getUsers)
    
    log.Println("User service is running on port 8080")
    http.ListenAndServe(":8080", nil)
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "ok", "service": "user-service"})
}

func registerUser(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    // Insertion dans la base de données
    result, err := db.Exec("INSERT INTO users (username, password) VALUES (?, ?)", user.Username, user.Password)
    if err != nil {
        log.Println("Error inserting user:", err)
        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    id, _ := result.LastInsertId()
    user.ID = int(id)

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func loginUser(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    // Vérification dans la base de données
    var storedPassword string
    err := db.QueryRow("SELECT password FROM users WHERE username = ?", user.Username).Scan(&storedPassword)
    if err != nil {
        http.Error(w, "User not found", http.StatusUnauthorized)
        return
    }

    if storedPassword != user.Password {
        http.Error(w, "Invalid password", http.StatusUnauthorized)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
}

func getUsers(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    rows, err := db.Query("SELECT id, username FROM users")
    if err != nil {
        http.Error(w, "Error fetching users", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.ID, &user.Username); err != nil {
            log.Println("Error scanning user:", err)
            continue
        }
        users = append(users, user)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}