package models

import (
	"time"

	"github.com/lib/pq"
)

type Listing struct {
	ID            uint              `json:"id" gorm:"primaryKey"`
	CreatedAt     time.Time         `json:"created_at"`
	UpdatedAt     time.Time         `json:"updated_at"`
	UserID        uint              `json:"user_id"`
	User          *User             `json:"user,omitempty" gorm:"foreignKey:UserID;references:ID"`
	Title         string            `json:"title"`
	Description   string            `json:"description"`
	ImageURLs     pq.StringArray    `json:"image_urls" gorm:"type:text[]"`
	Price         float64           `json:"price"`
	IsClosed      bool              `json:"is_closed"`
	WishlistedBy  []WishlistListing `gorm:"foreignKey:ListingID" json:"wishlisted_by,omitempty"`
	AIPriceReport *AIPriceReport    `gorm:"foreignKey:ListingID" json:"ai_price_report,omitempty"`
}
