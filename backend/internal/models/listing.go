package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Listing struct {
	ID          uint           	`json:"id" gorm:"primaryKey"`
    CreatedAt   time.Time      	`json:"created_at"`
    UpdatedAt   time.Time      	`json:"updated_at"`
    DeletedAt   gorm.DeletedAt 	`json:"deleted_at" gorm:"index"`
	UserID		uint			`json:"user_id"`
	Title		string			`json:"title"`
	Description	string			`json:"description"`
	ImageURLs 	pq.StringArray	`json:"image_urls" gorm:"type:text[]"`
	Price 		float64 		`json:"price"`
	IsClosed	bool			`json:"is_closed"`
}
