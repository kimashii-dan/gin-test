package models

import "time"

type WishlistListing struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	ListingID uint      `gorm:"not null" json:"listing_id"`
	User      User      `gorm:"constraint:OnDelete:CASCADE;" json:"user"`
	Listing   Listing   `gorm:"constraint:OnDelete:CASCADE;" json:"listing"`
}
