package main

import (
	"hash-club/config"
	"hash-club/handlers"
	"hash-club/middleware"
	"hash-club/repository"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	echoMw "github.com/labstack/echo/v4/middleware"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

func main() {
	config.Init()

	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}

	e.Use(echoMw.Logger())
	e.Use(echoMw.Recover())

	e.Use(echoMw.CORSWithConfig(echoMw.CORSConfig{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))

	userRepo := repository.NewUserRepository(config.DB)

	api := e.Group("/api")

	api.POST("/register", handlers.RegisterHandler(userRepo))
	api.POST("/login", handlers.LoginHandler(userRepo))
	api.POST("/logout", handlers.LogoutHandler())

	api.GET("/feed", handlers.FeedHandler(userRepo), middleware.JWT())

	log.Printf("Server running on %s", config.ServerPort)
	if err := e.Start(config.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
