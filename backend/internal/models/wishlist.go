package models

import "time"

type Wishlist struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	UserID    uint      `json:"user_id" gorm:"uniqueIndex;not null"`
	User      *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Listings  []Listing `gorm:"many2many:wishlist_listings;" json:"listings,omitempty"`
}
