// handlers/auth_handler.go
package handlers

import (
	"hash-club/config"
	"hash-club/models"
	"hash-club/repository"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

type registerReq struct {
	Username        string `json:"username" validate:"required,min=5,max=35"`
	Identity        string `json:"identity" validate:"required"`
	Password        string `json:"password" validate:"required,min=5,max=35"`
	PasswordConfirm string `json:"passwordConfirm" validate:"required"`
}

type loginReq struct {
	Identity string `json:"identity" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func RegisterHandler(users *repository.UserRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req registerReq
		if err := c.Bind(&req); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Неверный формат запроса"})
		}
		if err := c.Validate(&req); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
		}
		if req.Password != req.PasswordConfirm {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Пароли не совпадают"})
		}

		ctx := c.Request().Context()
		if _, err := users.FindByUsername(ctx, req.Username); err == nil {
			return c.JSON(http.StatusConflict, echo.Map{"error": "Имя пользователя занято"})
		}
		if _, err := users.FindByIdentity(ctx, req.Identity); err == nil {
			return c.JSON(http.StatusConflict, echo.Map{"error": "Электронная почта или телефон уже используется"})
		}

		hashBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Не удалось захешировать пароль"})
		}

		email := detectEmail(req.Identity)
		var phonePtr *string
		if p := detectPhone(req.Identity); p != "" {
			phonePtr = &p
		}

		user := &models.User{
			Username:     req.Username,
			Email:        email,
			Phone:        phonePtr,
			PasswordHash: string(hashBytes),
		}
		if err := users.Create(ctx, user); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Не удалось создать пользователя"})
		}
		return c.JSON(http.StatusCreated, echo.Map{"message": "Пользователь успешно зарегистрирован"})
	}
}

func LoginHandler(users *repository.UserRepository) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req loginReq
		if err := c.Bind(&req); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": "Неверный формат запроса"})
		}
		if err := c.Validate(&req); err != nil {
			return c.JSON(http.StatusBadRequest, echo.Map{"error": err.Error()})
		}

		ctx := c.Request().Context()
		user, err := users.FindByIdentity(ctx, req.Identity)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Неверные учётные данные"})
		}
		if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Неверные учётные данные"})
		}

		// Генерация JWT
		claims := jwt.MapClaims{
			"user_id":  user.ID,
			"username": user.Username,
			"exp":      time.Now().Add(time.Hour * 72).Unix(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		signed, err := token.SignedString([]byte(config.JwtSecret)) // <- передаём ключ как []byte
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Не удалось сгенерировать токен"})
		}

		// Устанавливаем cookie
		c.SetCookie(&http.Cookie{
			Name:     "jwt_token",
			Value:    signed,
			Path:     "/",
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
			Expires:  time.Now().Add(config.TokenTTL),
		})

		// Редирект на ленту
		return c.Redirect(http.StatusSeeOther, "/api/feed")
	}
}

func LogoutHandler() echo.HandlerFunc {
	return func(c echo.Context) error {
		c.SetCookie(&http.Cookie{
			Name:     "jwt_token",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
			Expires:  time.Unix(0, 0),
		})
		return c.JSON(http.StatusOK, echo.Map{"message": "Выход выполнен успешно"})
	}
}

func detectEmail(s string) string {
	if strings.Contains(s, "@") {
		return s
	}
	return ""
}

func detectPhone(s string) string {
	if !strings.Contains(s, "@") {
		return s
	}
	return ""
}
