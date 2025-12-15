package models

import (
	"time"
)

type Rating struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	UserID    uint      `json:"user_id"`                                                 // seller being rated
	User      *User     `json:"user,omitempty" gorm:"foreignKey:UserID;references:ID"`   // seller
	RaterID   uint      `json:"rater_id"`                                                // user who is rating
	Rater     *User     `json:"rater,omitempty" gorm:"foreignKey:RaterID;references:ID"` // rater
	ListingID *uint     `json:"listing_id,omitempty"`                                    // optional: related listing
	Listing   *Listing  `json:"listing,omitempty" gorm:"foreignKey:ListingID"`
	Rating    int       `json:"rating" gorm:"not null;check:rating >= 1 AND rating <= 5"` // 1-5 stars
	Comment   string    `json:"comment" gorm:"type:text"`
}
