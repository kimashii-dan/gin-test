package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"gin-backend/internal/services"
	"log"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type CreateListingDTO struct {
	Title           string                  `form:"title" binding:"required"`
	Description     string                  `form:"description"`
	Price           float64                 `form:"price"`
	Images          []*multipart.FileHeader `form:"images[]"`
	Category        string                  `form:"category"`
	PriceSuggestion string                  `form:"price_suggestion"`
}

func CreateListing(c *gin.Context) {
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

	// bind request body
	var body CreateListingDTO
	if err := c.ShouldBindWith(&body, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// convert JSON string into struct
	var priceSuggestion *services.PriceSuggestionResponse
	if body.PriceSuggestion != "" {
		if err := json.Unmarshal([]byte(body.PriceSuggestion), &priceSuggestion); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price suggestion format"})
			return
		}
	}

	// validate input data
	if strings.TrimSpace(body.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
		return
	}

	if body.Price < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price cannot be negative"})
		return
	}

	if len(body.Images) > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Too many images"})
		return
	}

	switch models.Category(body.Category) {
	case models.Electronics, models.Furniture, models.Books, models.Clothing, models.Services:
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
		return
	}

	// transaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	listing := models.Listing{
		Title:       body.Title,
		Description: body.Description,
		Price:       body.Price,
		Category:    models.Category(body.Category),
		IsClosed:    false,
		UserID:      user.ID,
	}
	if err := tx.Create(&listing).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create listing"})
		return
	}

	// price suggesiton might not be in the body
	if body.PriceSuggestion != "" {
		aiPriceReport := models.AIPriceReport{
			SuggestedPriceMin: priceSuggestion.SuggestedPriceMin,
			SuggestedPriceMax: priceSuggestion.SuggestedPriceMax,
			Currency:          priceSuggestion.Currency,
			ConfidenceLevel:   priceSuggestion.ConfidenceLevel,
			Reasoning:         priceSuggestion.Reasoning,
			ListingID:         listing.ID,
		}

		if err := tx.Create(&aiPriceReport).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create listing"})
			return
		}
	}

	var imageURLs []string
	if len(body.Images) > 0 {
		var err error

		// upload images to r2
		imageURLs, err = services.UploadImages(c.Request.Context(), body.Images, &user, "listings")
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		listing.ImageURLs = imageURLs
		if err := tx.Save(&listing).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update listing with images"})
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create listing"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"listing": listing,
	})

}

func GetMyListings(c *gin.Context) {
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"listings": listings,
	})
}

type UpdateListingDTO struct {
	Title       *string                 `form:"title"`
	Description *string                 `form:"description"`
	Price       *float64                `form:"price"`
	Category    *string                 `form:"category"`
	NewImages   []*multipart.FileHeader `form:"new_images"`
	KeptImages  []string                `form:"kept_images"`
	IsClosed    *bool                   `form:"is_closed"`
}

func UpdateListing(c *gin.Context) {
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

	// check if listing belongs to user
	listingID := c.Param("id")
	var listing models.Listing
	if err := database.DB.First(&listing, "id = ? AND user_id = ?", listingID, user.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	// binding body
	var body UpdateListingDTO
	if err := c.ShouldBindWith(&body, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// validate incoming listing fields
	if body.Title != nil && strings.TrimSpace(*body.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
		return
	}

	if body.Price != nil && *body.Price < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price cannot be negative"})
		return
	}

	if body.Category != nil {
		switch models.Category(*body.Category) {
		case models.Electronics, models.Furniture, models.Books, models.Clothing, models.Services:
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category"})
			return
		}
	}

	// check if amount of images exceeds limit
	if body.KeptImages != nil || body.NewImages != nil {
		totalImages := len(body.KeptImages) + len(body.NewImages)
		if totalImages > 5 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Total images cannot exceed 5"})
			return
		}
	}

	// validate that kept images belong to this listing
	if len(body.KeptImages) > 0 {
		originalImageMap := make(map[string]bool)
		for _, img := range listing.ImageURLs {
			originalImageMap[img] = true
		}

		for _, keptImg := range body.KeptImages {
			if !originalImageMap[keptImg] {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": fmt.Sprintf("Image %s does not belong to this listing", keptImg),
				})
				return
			}
		}
	}

	// trasaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// assign input to entity
	if body.Title != nil {
		listing.Title = *body.Title
	}

	if body.Description != nil {
		listing.Description = *body.Description
	}

	if body.Price != nil {
		listing.Price = *body.Price
	}

	if body.Category != nil {
		listing.Category = models.Category(*body.Category)
	}

	if body.IsClosed != nil {
		listing.IsClosed = *body.IsClosed
	}

	// save listing to db
	if err := tx.Save(&listing).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update listing"})
		return
	}

	if body.KeptImages != nil || body.NewImages != nil {

		kept := make(map[string]bool)
		for _, k := range body.KeptImages {
			kept[k] = true
		}

		// collect 'images to delete'
		var imagesToDelete []string
		for _, old := range listing.ImageURLs {
			if !kept[old] {
				imagesToDelete = append(imagesToDelete, old)
			}
		}

		// upload new images
		var newImageURLs []string
		if len(body.NewImages) > 0 {
			urls, err := services.UploadImages(c.Request.Context(), body.NewImages, &user, "listings")
			if err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			newImageURLs = urls
		}

		// save images to db
		listing.ImageURLs = append(body.KeptImages, newImageURLs...)
		if err := tx.Save(&listing).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update listing images"})
			return
		}

		if len(imagesToDelete) > 0 {
			go func() {
				for _, imgURL := range imagesToDelete {
					if err := services.DeleteImageByURL(context.Background(), imgURL); err != nil {
						log.Printf("warning: failed to delete old image %s: %v", imgURL, err)
					}
				}
			}()
		}

	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update listing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"listing": listing,
	})
}

func DeleteListing(c *gin.Context) {
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

	listingID := c.Param("id")

	var listing models.Listing
	if err := database.DB.First(&listing, "id = ? AND user_id = ?", listingID, user.ID).Error; err != nil {
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
		if err := services.DeleteImageByURL(c.Request.Context(), imgURL); err != nil {
			fmt.Printf("warning: failed to delete image: %v\n", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}

func ToggleWishlist(c *gin.Context) {
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

	listingID := c.Param("id")

	// check if listing exists
	var listing models.Listing
	if err := database.DB.First(&listing, "id = ?", listingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	// check if already in wishlist
	var existingWishlist models.WishlistListing
	err := database.DB.Where("user_id = ? AND listing_id = ?", user.ID, listing.ID).
		First(&existingWishlist).Error

	if err == nil {
		// already exists - remove it
		database.DB.Delete(&existingWishlist)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"action":  "removed",
		})
		return
	}

	// doesn't exist - add it
	wishlistItem := models.WishlistListing{
		UserID:    user.ID,
		ListingID: listing.ID,
	}

	if err := database.DB.Create(&wishlistItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to wishlist"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"action":  "added",
	})
}

func GetListingsFromWishlist(c *gin.Context) {
	var listings []models.Listing

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

	if database.DB.
		Joins("JOIN wishlist_listings ON wishlist_listings.listing_id = listings.id").
		Where("wishlist_listings.user_id = ?", user.ID).
		Order("wishlist_listings.created_at DESC").
		Find(&listings).Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	c.JSON(http.StatusOK, listings)
}

func CreateAIReport(c *gin.Context) {
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

	// check if listing exists and is owned by user
	listingID := c.Param("id")
	var listing models.Listing
	if err := database.DB.First(&listing, "id = ? AND user_id = ?", listingID, user.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	ctx := c.Request.Context()

	// bind body
	var body PriceSuggestionRequest
	if err := c.ShouldBindWith(&body, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Printf("Here's the body: %+v", body)

	// validate body data
	if strings.TrimSpace(body.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
		return
	}

	if len(body.Images) < 1 && len(body.ImageUrls) < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Listing must have at least 1 image"})
		return
	}

	// get ai report
	priceSuggestionResponse, err := services.SuggestPrice(ctx, body.Title, body.Language, body.Description, body.Images, body.ImageUrls)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	aiPriceReport := models.AIPriceReport{
		SuggestedPriceMin: priceSuggestionResponse.SuggestedPriceMin,
		SuggestedPriceMax: priceSuggestionResponse.SuggestedPriceMax,
		Currency:          priceSuggestionResponse.Currency,
		ConfidenceLevel:   priceSuggestionResponse.ConfidenceLevel,
		Reasoning:         priceSuggestionResponse.Reasoning,
		ListingID:         listing.ID,
	}

	if err := database.DB.Create(&aiPriceReport).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save AI report"})
		return
	}

	c.JSON(http.StatusCreated, aiPriceReport)
}
