package handlers

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetListings(c *gin.Context) {
	userAny, userExists := c.Get("user")

	var listings []models.Listing
	if err := database.DB.Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	if !userExists {
		var response []ListingResponse
		for _, listing := range listings {
			response = append(response, ListingResponse{
				Listing:      listing,
				IsInWishlist: false,
			})
		}
		c.JSON(http.StatusOK, response)
		return
	}

	user := userAny.(models.User)
	var response []ListingResponse

	for _, listing := range listings {
		var count int64
		database.DB.Model(&models.WishlistListing{}).
			Where("user_id = ? AND listing_id = ?", user.ID, listing.ID).
			Count(&count)

		response = append(response, ListingResponse{
			Listing:      listing,
			IsInWishlist: count > 0,
		})
	}

	c.JSON(http.StatusOK, response)
}

type ListingResponse struct {
	Listing      models.Listing `json:"listing"`
	IsInWishlist bool           `json:"is_in_wishlist"`
}

func GetListing(c *gin.Context) {
	listingID := c.Param("id")

	userAny, userExists := c.Get("user")

	var listing models.Listing
	query := database.DB.Preload("User")

	err := query.First(&listing, "id = ?", listingID).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	if userExists {
		user := userAny.(models.User)
		if listing.UserID == user.ID {
			query = database.DB.Preload("User").Preload("AIPriceReport")
			err = query.First(&listing, "id = ?", listingID).Error
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
				return
			}
		}
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

	listingResponse := ListingResponse{
		listing,
		isInWishlist,
	}

	c.JSON(http.StatusOK, listingResponse)
}

// func GetUserWithListing(c *gin.Context) {
// 	userID := c.Param("id")

// 	var user models.User
// 	if err := database.DB.Preload("Listings").First(&user, "id = ?", userID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, user)
// }

type UserWithListingsResponse struct {
	ID           uint              `json:"id"`
	CreatedAt    time.Time         `json:"created_at"`
	UpdatedAt    time.Time         `json:"updated_at"`
	Name         string            `json:"name"`
	Email        string            `json:"email"`
	University   string            `json:"university"`
	Phone        string            `json:"phone"`
	TelegramLink string            `json:"telegram_link"`
	Bio          string            `json:"bio"`
	AvatarURL    string            `json:"avatar_url"`
	Listings     []ListingResponse `json:"listings"`
}

func GetUserWithListing(c *gin.Context) {
	otherUserID := c.Param("id")
	var otherUser models.User
	if err := database.DB.Preload("Listings").First(&otherUser, "id = ?", otherUserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	userAny, userExists := c.Get("user")

	var listingsResponse []ListingResponse

	if !userExists {
		for _, listing := range otherUser.Listings {
			listingsResponse = append(listingsResponse, ListingResponse{
				Listing:      listing,
				IsInWishlist: false,
			})
		}
	} else {

		user := userAny.(models.User)
		for _, listing := range otherUser.Listings {
			var count int64
			database.DB.Model(&models.WishlistListing{}).
				Where("user_id = ? AND listing_id = ?", user.ID, listing.ID).
				Count(&count)

			listingsResponse = append(listingsResponse, ListingResponse{
				Listing:      listing,
				IsInWishlist: count > 0,
			})
		}
	}

	response := UserWithListingsResponse{
		ID:           otherUser.ID,
		CreatedAt:    otherUser.UpdatedAt,
		UpdatedAt:    otherUser.UpdatedAt,
		Name:         otherUser.Name,
		Email:        otherUser.Email,
		University:   otherUser.University,
		Phone:        otherUser.Phone,
		TelegramLink: otherUser.TelegramLink,
		Bio:          otherUser.Bio,
		AvatarURL:    otherUser.AvatarURL,
		Listings:     listingsResponse,
	}

	c.JSON(http.StatusOK, response)
}
