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

		claims := jwt.MapClaims{
			"user_id":  user.ID,
			"username": user.Username,
			"exp":      time.Now().Add(time.Hour * 72).Unix(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		signed, err := token.SignedString([]byte(config.JwtSecret))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Не удалось сгенерировать токен"})
		}

		c.SetCookie(&http.Cookie{
			Name:     "jwt_token",
			Value:    signed,
			Path:     "/",
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
			Expires:  time.Now().Add(config.TokenTTL),
		})

		return c.JSON(http.StatusOK, echo.Map{"token": signed, "message": "Login successful"})
	}
}