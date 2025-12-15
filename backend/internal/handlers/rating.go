package handlers

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateRatingDTO struct {
	UserID    uint   `json:"user_id" binding:"required"` // seller ID
	Rating    int    `json:"rating" binding:"required,min=1,max=5"`
	Comment   string `json:"comment"`
	ListingID *uint  `json:"listing_id"`
}

type UpdateRatingDTO struct {
	Rating  int    `json:"rating" binding:"required,min=1,max=5"`
	Comment string `json:"comment"`
}

// CreateRating creates a new rating for a seller
func CreateRating(c *gin.Context) {
	userAny, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "User not found in context",
		})
		return
	}

	rater, ok := userAny.(models.User)
	if !ok {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid user type",
		})
		return
	}

	var body CreateRatingDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user is trying to rate themselves
	if body.UserID == rater.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot rate yourself"})
		return
	}

	// Check if the seller exists
	var seller models.User
	if err := database.DB.First(&seller, body.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
		return
	}

	// Check if listing exists (if provided)
	if body.ListingID != nil {
		var listing models.Listing
		if err := database.DB.First(&listing, *body.ListingID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
			return
		}

		// Verify the listing belongs to the seller
		if listing.UserID != body.UserID {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Listing does not belong to this seller"})
			return
		}

		// Check if rater already rated this seller for this listing
		var existingRating models.Rating
		if err := database.DB.Where("user_id = ? AND rater_id = ? AND listing_id = ?",
			body.UserID, rater.ID, body.ListingID).First(&existingRating).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "You have already rated this seller for this listing"})
			return
		}
	} else {
		// Check if rater already rated this seller without a listing
		var existingRating models.Rating
		if err := database.DB.Where("user_id = ? AND rater_id = ? AND listing_id IS NULL",
			body.UserID, rater.ID).First(&existingRating).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "You have already rated this seller"})
			return
		}
	}

	// Create the rating
	rating := models.Rating{
		UserID:    body.UserID,
		RaterID:   rater.ID,
		Rating:    body.Rating,
		Comment:   body.Comment,
		ListingID: body.ListingID,
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// Create rating
		if err := tx.Create(&rating).Error; err != nil {
			return err
		}

		// Update seller's average rating and count
		var avgRating float64
		var count int64

		tx.Model(&models.Rating{}).Where("user_id = ?", body.UserID).Count(&count)
		tx.Model(&models.Rating{}).Where("user_id = ?", body.UserID).Select("AVG(rating)").Row().Scan(&avgRating)

		if err := tx.Model(&seller).Updates(map[string]interface{}{
			"average_rating": avgRating,
			"rating_count":   count,
		}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Load rater and seller info
	database.DB.Preload("Rater").Preload("User").First(&rating, rating.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"rating":  rating,
	})
}

// GetUserRatings gets all ratings for a specific user (seller)
func GetUserRatings(c *gin.Context) {
	userID := c.Param("id")

	// Check if user exists
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var ratings []models.Rating
	if err := database.DB.Where("user_id = ?", userID).
		Preload("Rater").
		Preload("Listing").
		Order("created_at DESC").
		Find(&ratings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ratings":        ratings,
		"average_rating": user.AverageRating,
		"rating_count":   user.RatingCount,
	})
}

// UpdateRating updates an existing rating
func UpdateRating(c *gin.Context) {
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

	ratingID := c.Param("id")

	var body UpdateRatingDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var rating models.Rating
	if err := database.DB.First(&rating, ratingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rating not found"})
		return
	}

	// Check if the user is the one who created the rating
	if rating.RaterID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update your own ratings"})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// Update rating
		rating.Rating = body.Rating
		rating.Comment = body.Comment

		if err := tx.Save(&rating).Error; err != nil {
			return err
		}

		// Recalculate seller's average rating
		var avgRating float64
		var count int64

		tx.Model(&models.Rating{}).Where("user_id = ?", rating.UserID).Count(&count)
		tx.Model(&models.Rating{}).Where("user_id = ?", rating.UserID).Select("AVG(rating)").Row().Scan(&avgRating)

		var seller models.User
		if err := tx.First(&seller, rating.UserID).Error; err != nil {
			return err
		}

		if err := tx.Model(&seller).Updates(map[string]interface{}{
			"average_rating": avgRating,
			"rating_count":   count,
		}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reload rating with relations
	database.DB.Preload("Rater").Preload("User").First(&rating, rating.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"rating":  rating,
	})
}

// DeleteRating deletes a rating
func DeleteRating(c *gin.Context) {
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

	ratingID := c.Param("id")

	var rating models.Rating
	if err := database.DB.First(&rating, ratingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rating not found"})
		return
	}

	// Check if the user is the one who created the rating
	if rating.RaterID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own ratings"})
		return
	}

	sellerID := rating.UserID

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// Delete rating
		if err := tx.Delete(&rating).Error; err != nil {
			return err
		}

		// Recalculate seller's average rating
		var avgRating float64
		var count int64

		tx.Model(&models.Rating{}).Where("user_id = ?", sellerID).Count(&count)

		if count > 0 {
			tx.Model(&models.Rating{}).Where("user_id = ?", sellerID).Select("AVG(rating)").Row().Scan(&avgRating)
		} else {
			avgRating = 0
		}

		var seller models.User
		if err := tx.First(&seller, sellerID).Error; err != nil {
			return err
		}

		if err := tx.Model(&seller).Updates(map[string]interface{}{
			"average_rating": avgRating,
			"rating_count":   count,
		}).Error; err != nil {
			return err
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

// GetMyRatingsGiven gets all ratings given by the current user
func GetMyRatingsGiven(c *gin.Context) {
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

	var ratings []models.Rating
	if err := database.DB.Where("rater_id = ?", user.ID).
		Preload("User").
		Preload("Listing").
		Order("created_at DESC").
		Find(&ratings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ratings)
}

// CheckUserRating checks if current user has rated a specific seller for a listing
func CheckUserRating(c *gin.Context) {
	userAny, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusOK, gin.H{
			"has_rated": false,
			"rating":    nil,
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

	sellerID := c.Param("sellerId")
	listingIDStr := c.Query("listing_id")

	var rating models.Rating
	query := database.DB.Where("user_id = ? AND rater_id = ?", sellerID, user.ID)

	if listingIDStr != "" {
		listingID, err := strconv.Atoi(listingIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid listing ID"})
			return
		}
		query = query.Where("listing_id = ?", listingID)
	} else {
		query = query.Where("listing_id IS NULL")
	}

	err := query.Preload("Rater").Preload("User").First(&rating).Error

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"has_rated": false,
			"rating":    nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"has_rated": true,
		"rating":    rating,
	})
}
