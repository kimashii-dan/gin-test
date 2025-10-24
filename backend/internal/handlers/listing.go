package handlers

import (
	"fmt"
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"gin-backend/internal/services"
	"log"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreateListingDTO struct {
	Title       string                  `form:"title" binding:"required"`
	Description string                  `form:"description"`
	Price       float64                 `form:"price"`
	Images      []*multipart.FileHeader `form:"images[]"`
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

	var body CreateListingDTO

	if err := c.ShouldBind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Here's the body: %+v", body)

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

	listing := models.Listing{
		Title:       body.Title,
		Description: body.Description,
		Price:       body.Price,
		IsClosed:    false,
		UserID:      user.ID,
	}

	// create listing in db
	if err := database.DB.Create(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create listing"})
		return
	}

	if len(body.Images) > 0 {
		// upload listing images to r2
		imageURLs, err := services.UploadImages(c.Request.Context(), body.Images, &user, "listings")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		for _, value := range imageURLs {
			log.Printf("Here's url: %s", value)
		}

		// save listing images ind db
		listing.ImageURLs = imageURLs
		if err := database.DB.Save(&listing).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update listing with images"})
			return
		}
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

func GetListings(c *gin.Context) {
	_, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "User not found in context",
		})
		return
	}

	var listings []models.Listing
	if err := database.DB.Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"listings": listings,
	})
}

func GetListing(c *gin.Context) {
	_, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "User not found in context",
		})
		return
	}

	listingID := c.Param("id")

	var listing models.Listing
	if err := database.DB.First(&listing, "id = ?", listingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"listing": listing,
	})
}

type UpdateListingDTO struct {
	Title          *string                 `form:"title"`
	Description    *string                 `form:"description"`
	Price          *float64                `form:"price"`
	NewImages      []*multipart.FileHeader `form:"new_images"`
	ImagesToDelete []string                `form:"kept_images"`
	IsClosed       *bool                   `form:"is_closed"`
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

	var body UpdateListingDTO
	if err := c.ShouldBind(&body); err != nil {
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

	// check if amount of images exceeds limit
	totalImages := len(listing.ImageURLs) - len(body.ImagesToDelete) + len(body.NewImages)
	if totalImages > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Total images cannot exceed 5"})
		return
	}

	// validate that kept images belong to this listing
	if len(body.ImagesToDelete) > 0 {
		originalImageMap := make(map[string]bool)
		for _, img := range listing.ImageURLs {
			originalImageMap[img] = true
		}

		for _, delImg := range body.ImagesToDelete {
			if !originalImageMap[delImg] {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": fmt.Sprintf("Image %s does not belong to this listing", delImg),
				})
				return
			}
		}
	}

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

	if body.IsClosed != nil {
		listing.IsClosed = *body.IsClosed
	}

	// save listing to db
	if err := database.DB.Save(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update listing"})
		return
	}

	var imagesToKeep []string
	kept := make(map[string]bool)
	for _, k := range body.ImagesToDelete {
		kept[k] = true
	}

	// collect 'images to delete'
	for _, old := range listing.ImageURLs {
		if !kept[old] {
			imagesToKeep = append(imagesToKeep, old)
		}
	}

	// upload new images
	var newImageURLs []string
	if len(body.NewImages) > 0 {
		urls, err := services.UploadImages(c.Request.Context(), body.NewImages, &user, "listings")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		newImageURLs = urls
	}

	// save images to db
	listing.ImageURLs = append(imagesToKeep, newImageURLs...)
	if err := database.DB.Save(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update listing images"})
		return
	}

	// delete images from r2
	for _, imgURL := range body.ImagesToDelete {
		if err := services.DeleteImageByURL(c.Request.Context(), imgURL); err != nil {
			fmt.Printf("warning: failed to delete old image %s: %v\n", imgURL, err)
		}
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

	if err := database.DB.Delete(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for _, imgURL := range listing.ImageURLs {
		if err := services.DeleteImageByURL(c.Request.Context(), imgURL); err != nil {
			fmt.Printf("warning: failed to delete image: %v\n", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}
