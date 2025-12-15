package models

import (
	"time"
)

type User struct {
	ID            uint              `json:"id" gorm:"primaryKey"`
	CreatedAt     time.Time         `json:"created_at"`
	UpdatedAt     time.Time         `json:"updated_at"`
	Email         string            `json:"email"`
	Password      string            `json:"-"`
	Name          string            `json:"name"`
	University    string            `json:"university"`
	Phone         string            `json:"phone"`
	TelegramLink  string            `json:"telegram_link"`
	Bio           string            `json:"bio"`
	AvatarURL     string            `json:"avatar_url"`
	AverageRating float64           `json:"average_rating" gorm:"default:0"`
	RatingCount   int               `json:"rating_count" gorm:"default:0"`
	Listings      []Listing         `gorm:"foreignKey:UserID" json:"listings,omitempty"`
	Wishlist      []WishlistListing `gorm:"foreignKey:UserID" json:"wishlist,omitempty"`
	Ratings       []Rating          `gorm:"foreignKey:UserID" json:"ratings,omitempty"`
}
