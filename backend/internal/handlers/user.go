package handlers

import (
	"fmt"
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"gin-backend/internal/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UpdateUserDTO struct {
	Name         *string `json:"name"`
	University   *string `json:"university"`
	Phone        *string `json:"phone"`
	TelegramLink *string `json:"telegram_link"`
	Bio          *string `json:"bio"`
}

func UpdateUser(c *gin.Context) {
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

	var body UpdateUserDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// validate input data
	if body.Name != nil && strings.TrimSpace(*body.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name cannot be empty"})
		return
	}

	if body.Name != nil {
		user.Name = *body.Name
	}

	if body.University != nil {
		user.University = *body.University
	}

	if body.Phone != nil {
		user.Phone = *body.Phone
	}

	if body.TelegramLink != nil {
		user.TelegramLink = *body.TelegramLink
	}

	if body.Bio != nil {
		user.Bio = *body.Bio
	}

	// save user to db
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user":    user,
	})
}

func DeleteUser(c *gin.Context) {
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
	})
}

func GetUser(c *gin.Context) {
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

	var listings []models.Listing
	if err := database.DB.Where("user_id = ?", user.ID).Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []ListingResponse
	for _, listing := range listings {
		response = append(response, ListingResponse{
			Listing:      listing,
			IsInWishlist: false,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"user":     user,
		"listings": response,
	})
}

func UploadAvatar(c *gin.Context) {
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

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received. Please upload an image with the key 'image'."})
		return
	}

	// store old avatar to delete later
	oldAvatar := user.AvatarURL

	// upload new image
	newURL, err := services.UploadImage(c.Request.Context(), file, &user, "avatars")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// replace avatar with new image
	if err := database.DB.Model(&user).Update("avatar_url", newURL).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update avatar URL in database"})
		return
	}

	// if user had avatar, delete it
	if oldAvatar != "" {
		if err := services.DeleteImageByURL(c.Request.Context(), oldAvatar); err != nil {
			fmt.Printf("warning: failed to delete old avatar %s: %v\n", oldAvatar, err)
		}
	}

	user.AvatarURL = newURL

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"imageURL": user.AvatarURL,
	})
}
