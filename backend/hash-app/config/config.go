// config/config.go
package config

import (
	"context"
	"database/sql"
	"fmt"
	"hash-club/models"
	"log"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB         *gorm.DB
	ServerPort string
	TokenTTL   time.Duration
	JwtSecret  string
)

func Init() {
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found or error loading .env: %v", err)
	}

	if p := os.Getenv("SERVER_PORT"); p != "" {
		ServerPort = p
	} else {
		ServerPort = ":7777"
	}

	ttlStr := getEnv("JWT_TTL_HOURS", "24")
	if d, err := time.ParseDuration(ttlStr + "h"); err != nil {
		TokenTTL = 24 * time.Hour
	} else {
		TokenTTL = d
	}

	JwtSecret = os.Getenv("JWT_SECRET")
	if strings.TrimSpace(JwtSecret) == "" {
		log.Fatal("Environment variable JWT_SECRET must be set")
	}

	ConnectPostgres()
}

func ConnectPostgres() {
	user := os.Getenv("PG_USER")
	pass := os.Getenv("PG_PASSWORD")
	host := getEnv("PG_HOST", "localhost")
	port := getEnv("PG_PORT", "5432")
	dbName := os.Getenv("PG_DB")
	ssl := getEnv("PG_SSLMODE", "disable")

	if user == "" || pass == "" || dbName == "" {
		log.Fatal("PG_USER, PG_PASSWORD and PG_DB must be set")
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, pass, dbName, ssl,
	)

	sqlDB, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("sql.Open error: %v", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := sqlDB.PingContext(ctx); err != nil {
		log.Fatalf("Ping Postgres error: %v", err)
	}

	gormDB, err := gorm.Open(postgres.New(postgres.Config{Conn: sqlDB}), &gorm.Config{})
	if err != nil {
		log.Fatalf("gorm.Open error: %v", err)
	}

	DB = gormDB
	log.Printf("Connected to Postgres %s@%s:%s/%s (sslmode=%s)", user, host, port, dbName, ssl)

	if err := DB.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("AutoMigrate User error: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
