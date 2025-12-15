package handlers

import (
	"context"
	"fmt"
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"gin-backend/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AdminUserResponse struct {
	ID            uint    `json:"id"`
	Email         string  `json:"email"`
	Name          string  `json:"name"`
	University    string  `json:"university"`
	ListingsCount int64   `json:"listings_count"`
	AverageRating float64 `json:"average_rating"`
	RatingCount   int     `json:"rating_count"`
}

type AdminListingResponse struct {
	ID          uint    `json:"id"`
	Title       string  `json:"title"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	IsClosed    bool    `json:"is_closed"`
	UserID      uint    `json:"user_id"`
	UserEmail   string  `json:"user_email"`
	UserName    string  `json:"user_name"`
	ImagesCount int     `json:"images_count"`
}

// GetAllUsers returns all users with their listing count
func GetAllUsers(c *gin.Context) {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	var response []AdminUserResponse
	for _, user := range users {
		var listingsCount int64
		database.DB.Model(&models.Listing{}).Where("user_id = ?", user.ID).Count(&listingsCount)

		response = append(response, AdminUserResponse{
			ID:            user.ID,
			Email:         user.Email,
			Name:          user.Name,
			University:    user.University,
			ListingsCount: listingsCount,
			AverageRating: user.AverageRating,
			RatingCount:   user.RatingCount,
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetAllListings returns all listings with user info
func GetAllListings(c *gin.Context) {
	var listings []models.Listing
	if err := database.DB.Preload("User").Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	var response []AdminListingResponse
	for _, listing := range listings {
		userName := ""
		userEmail := ""
		if listing.User != nil {
			userName = listing.User.Name
			userEmail = listing.User.Email
		}

		response = append(response, AdminListingResponse{
			ID:          listing.ID,
			Title:       listing.Title,
			Price:       listing.Price,
			Category:    string(listing.Category),
			IsClosed:    listing.IsClosed,
			UserID:      listing.UserID,
			UserEmail:   userEmail,
			UserName:    userName,
			ImagesCount: len(listing.ImageURLs),
		})
	}

	c.JSON(http.StatusOK, response)
}

// AdminDeleteUser deletes a user and all their data
func AdminDeleteUser(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// find user listings
		var listings []models.Listing
		if err := tx.Where("user_id = ?", user.ID).Find(&listings).Error; err != nil {
			return fmt.Errorf("failed to fetch user listings: %w", err)
		}

		// delete listing images
		for _, listing := range listings {
			for _, imgURL := range listing.ImageURLs {
				if err := services.DeleteImageByURL(c.Request.Context(), imgURL); err != nil {
					fmt.Printf("warning: failed to delete listing image %s: %v\n", imgURL, err)
				}
			}
		}

		// delete listings
		if err := tx.Where("user_id = ?", user.ID).Delete(&models.Listing{}).Error; err != nil {
			return fmt.Errorf("failed to delete user listings: %w", err)
		}

		// delete user's avatar
		if user.AvatarURL != "" {
			if err := services.DeleteImageByURL(c.Request.Context(), user.AvatarURL); err != nil {
				fmt.Printf("warning: failed to delete user avatar %s: %v\n", user.AvatarURL, err)
			}
		}

		// delete user
		if err := tx.Delete(&user).Error; err != nil {
			return fmt.Errorf("failed to delete user: %w", err)
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("User %s deleted successfully", user.Email),
	})
}

// AdminDeleteListing deletes a listing
func AdminDeleteListing(c *gin.Context) {
	listingID := c.Param("id")

	var listing models.Listing
	if err := database.DB.First(&listing, "id = ?", listingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	// delete listing in db
	if err := database.DB.Delete(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// delete listing images in storage
	for _, imgURL := range listing.ImageURLs {
		if err := services.DeleteImageByURL(context.Background(), imgURL); err != nil {
			fmt.Printf("warning: failed to delete image: %v\n", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Listing '%s' deleted successfully", listing.Title),
	})
}
