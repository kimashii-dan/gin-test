package handlers

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DashboardStats struct {
	TotalListings  int64   `json:"total_listings"`
	ActiveListings int64   `json:"active_listings"`
	ClosedListings int64   `json:"closed_listings"`
	TotalWishlists int64   `json:"total_wishlists"`
	AveragePrice   float64 `json:"average_price"`
}

type DashboardData struct {
	Stats    DashboardStats    `json:"stats"`
	Listings []ListingResponse `json:"listings"`
	Ratings  struct {
		Ratings       []models.Rating `json:"ratings"`
		AverageRating float64         `json:"average_rating"`
		RatingCount   int64           `json:"rating_count"`
	} `json:"ratings"`
}

func GetDashboard(c *gin.Context) {
	userAny, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "User not found in context",
		})
		return
	}

	user, ok := userAny.(models.User)
	if !ok {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid user type",
		})
		return
	}

	var dashboardData DashboardData

	// Get stats
	database.DB.Model(&models.Listing{}).Where("user_id = ?", user.ID).Count(&dashboardData.Stats.TotalListings)
	database.DB.Model(&models.Listing{}).Where("user_id = ? AND is_closed = ?", user.ID, false).Count(&dashboardData.Stats.ActiveListings)
	database.DB.Model(&models.Listing{}).Where("user_id = ? AND is_closed = ?", user.ID, true).Count(&dashboardData.Stats.ClosedListings)
	database.DB.Table("wishlist_listings").
		Joins("JOIN listings ON wishlist_listings.listing_id = listings.id").
		Where("listings.user_id = ?", user.ID).
		Count(&dashboardData.Stats.TotalWishlists)
	database.DB.Model(&models.Listing{}).
		Where("user_id = ?", user.ID).
		Select("COALESCE(AVG(price), 0)").
		Scan(&dashboardData.Stats.AveragePrice)

	// Get user's listings
	var listings []models.Listing
	if err := database.DB.Where("user_id = ?", user.ID).Order("created_at DESC").Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	for _, listing := range listings {
		dashboardData.Listings = append(dashboardData.Listings, ListingResponse{
			Listing:      listing,
			IsInWishlist: false,
		})
	}

	// Get user's ratings
	var ratings []models.Rating
	if err := database.DB.Where("user_id = ?", user.ID).
		Preload("Rater").
		Preload("Listing").
		Order("created_at DESC").
		Find(&ratings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch ratings"})
		return
	}

	dashboardData.Ratings.Ratings = ratings
	dashboardData.Ratings.AverageRating = user.AverageRating
	dashboardData.Ratings.RatingCount = int64(user.RatingCount)

	c.JSON(http.StatusOK, dashboardData)
}
