package models

import (
	"time"

	"gorm.io/gorm"
)

// User представляет структуру пользователя в PostgreSQL через GORM.
type User struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Username     string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"username"`
	Email        string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Phone        *string        `gorm:"type:varchar(20)" json:"phone,omitempty"`
	PasswordHash string         `gorm:"type:varchar(255);not null" json:"-"`
	CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"-"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
