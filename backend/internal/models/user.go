package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at" gorm:"index"`
	Email        string         `json:"email"`
	Password     string         `json:"-"`
	Name         string         `json:"name" gorm:"default:'Anonymous'"`
	University   string         `json:"university"`
	Phone        string         `json:"phone"`
	TelegramLink string         `json:"telegram_link"`
	Bio          string         `json:"bio"`
	AvatarURL    string         `json:"avatar_url"`
	Listings     []Listing      `json:"listing"`
}
