// cmd/main.go
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

// CustomValidator обёртка для валидации структур с помощью go-playground/validator
type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

func main() {
	// 1. Инициализация конфига (.env, DB, JwtSecret, TokenTTL, ServerPort и т.п.)
	config.Init()

	// 2. Создаём Echo и устанавливаем validator
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}

	// 3. Глобальные middleware: логирование и восстановление после паник
	e.Use(echoMw.Logger())
	e.Use(echoMw.Recover())

	e.Use(echoMw.CORSWithConfig(echoMw.CORSConfig{
		AllowOrigins:     []string{"http://192.168.0.101:5173"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true, // важно, чтобы куки с токеном передавались
	}))

	// 4. Репозиторий пользователей на GORM
	userRepo := repository.NewUserRepository(config.DB)

	// 5. Группа с префиксом /api
	api := e.Group("/api")

	// 6. Публичные маршруты внутри /api
	api.POST("/registration", handlers.RegisterHandler(userRepo))
	api.POST("/login", handlers.LoginHandler(userRepo))
	api.POST("/logout", handlers.LogoutHandler())

	// 7. Защищённый маршрут /feed внутри /api
	api.GET("/feed", handlers.FeedHandler(userRepo), middleware.JWT())

	// 8. Запуск сервера
	log.Printf("Server running on %s", config.ServerPort)
	if err := e.Start(config.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
