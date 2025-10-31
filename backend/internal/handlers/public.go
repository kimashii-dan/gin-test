package handlers

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetListings(c *gin.Context) {
	var listings []models.Listing
	if err := database.DB.Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	c.JSON(http.StatusOK, listings)
}

func GetListing(c *gin.Context) {
	listingID := c.Param("id")

	userAny, userExists := c.Get("user")

	var listing models.Listing
	err := database.DB.
		Preload("User").
		First(&listing, "id = ?", listingID).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	isInWishlist := false
	if userExists {
		user := userAny.(models.User)

		var count int64
		database.DB.Model(&models.WishlistListing{}).
			Where("user_id = ? AND listing_id = ?", user.ID, listing.ID).
			Count(&count)

		isInWishlist = count > 0
	}

	c.JSON(http.StatusOK, gin.H{
		"listing":        listing,
		"is_in_wishlist": isInWishlist,
	})
}

func GetUserWithListing(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.Preload("Listings").First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}
