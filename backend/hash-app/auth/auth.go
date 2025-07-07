package auth

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"os"
	"strings"
)

var JwtSecret []byte

func init() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" || os.Getenv("JWT_SECRET") == "secret_key" {
		secret = generateFallbackSecret()
		log.Printf("WARNING: Using auto-generated JWT_SECRET. For production, set JWT_SECRET in .env")
	}
	JwtSecret = []byte(secret)
}

func init() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" || secret == "secret_key" {
		secret = generateFallbackSecret()
		log.Printf("Generating new JWT_SECRET: %s", secret)

		if err := persistSecretToEnv(secret); err != nil {
			log.Printf("WARNING: Failed to save JWT_SECRET to .env: %v", err)
		}
	}
	JwtSecret = []byte(secret)
}

func persistSecretToEnv(secret string) error {
	envPath := ".env"

	content, err := os.ReadFile(envPath)
	if err != nil {
		return err
	}

	lines := strings.Split(string(content), "\n")
	updated := false
	for i, line := range lines {
		if strings.HasPrefix(line, "JWT_SECRET=") {
			lines[i] = `JWT_SECRET="` + secret + `"`
			updated = true
			break
		}
	}

	if !updated {
		lines = append(lines, `JWT_SECRET="`+secret+`"`)
	}

	return os.WriteFile(envPath, []byte(strings.Join(lines, "\n")), 0644)
}

func generateFallbackSecret() string {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		log.Fatal("Failed to generate fallback JWT secret")
	}
	return base64.URLEncoding.EncodeToString(b)
}
