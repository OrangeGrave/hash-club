package handlers

import (
	"hash-club/repository"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func FeedHandler(users *repository.UserRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims := c.Get("claims").(jwt.MapClaims)
		username := claims["username"]
		return c.JSON(http.StatusOK, echo.Map{
			"message":  "Добро пожаловать в ленту!",
			"username": username,
		})
	}
}
