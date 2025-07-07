// middleware/jwt_middleware.go
package middleware

import (
	"hash-club/config"
	"log"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// JWT возвращает middleware для проверки JWT-токена из куки
func JWT() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cookie, err := c.Cookie("jwt_token")
			if err != nil {
				log.Printf("No jwt_token cookie: %v", err)
				return c.JSON(http.StatusUnauthorized, echo.Map{"error": "missing or invalid token"})
			}
			log.Printf("jwt_token: %s", cookie.Value)

			token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					log.Printf("Invalid signing method: %v", token.Method)
					return nil, echo.NewHTTPError(http.StatusUnauthorized, "invalid signing method")
				}
				return []byte(config.JwtSecret), nil // 🔥 fix: передаём []byte!
			})

			if err != nil || !token.Valid {
				log.Printf("Invalid token: %v", err)
				return c.JSON(http.StatusUnauthorized, echo.Map{"error": "invalid token"})
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				log.Printf("Invalid claims")
				return c.JSON(http.StatusUnauthorized, echo.Map{"error": "invalid token claims"})
			}
			log.Printf("Claims: %v", claims)
			c.Set("claims", claims)

			return next(c)
		}
	}
}
