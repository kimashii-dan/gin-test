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

	var listing models.Listing
	if err := database.DB.Preload("User").First(&listing, "id = ?", listingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"listing": listing,
	})
}

func GetUserWithListing(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.Preload("Listings").First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
