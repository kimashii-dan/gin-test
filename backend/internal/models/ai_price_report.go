package models

type AIPriceReport struct {
	ID                uint    `json:"id" gorm:"primaryKey"`
	SuggestedPriceMin float64 `json:"suggested_price_min"`
	SuggestedPriceMax float64 `json:"suggested_price_max"`
	Currency          string  `json:"currency"`
	ConfidenceLevel   string  `json:"confidence_level"`
	Reasoning         string  `json:"reasoning"`
	ListingID         uint    `gorm:"not null" json:"listing_id"`
}

func (AIPriceReport) TableName() string {
	return "ai_price_reports"
}
