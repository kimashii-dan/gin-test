package handlers

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ListingResponse struct {
	Listing      models.Listing `json:"listing"`
	IsInWishlist bool           `json:"is_in_wishlist"`
}

func GetListings(c *gin.Context) {
	// 1. Just find all listings
	var listings []models.Listing
	if err := database.DB.Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listings"})
		return
	}

	// 2. Check if user is authenticated
	userAny, exists := c.Get("user")
	if !exists {
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

	// 3. Get wishlisted listing IDs
	user := userAny.(models.User)
	listingIDs := make([]uint, len(listings))
	for i, listing := range listings {
		listingIDs[i] = listing.ID
	}

	// Single query to get all wishlisted IDs
	var wishlistedIDs []uint
	database.DB.Model(&models.WishlistListing{}).
		Where("user_id = ? AND listing_id IN ?", user.ID, listingIDs).
		Pluck("listing_id", &wishlistedIDs)

	wishlistMap := make(map[uint]bool)
	for _, id := range wishlistedIDs {
		wishlistMap[id] = true
	}

	// 4. Build response with wishlist status
	var response []ListingResponse
	for _, listing := range listings {
		response = append(response, ListingResponse{
			Listing:      listing,
			IsInWishlist: wishlistMap[listing.ID],
		})
	}

	c.JSON(http.StatusOK, response)
}

func GetListing(c *gin.Context) {
	listingID := c.Param("id")
	var listing models.Listing

	// check if user is authenticated
	userAny, userExists := c.Get("user")
	var user models.User
	var userID uint
	if userExists {
		user = userAny.(models.User)
		userID = user.ID
	}

	// query that preloads user
	query := database.DB.Preload("User")

	// find listing in db with query that preloads user
	if err := query.First(&listing, "id = ?", listingID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	// if user is authenticated and owns listing -> load ai report
	if userExists && listing.UserID == userID {
		database.DB.Preload("AIPriceReport").First(&listing, "id = ?", listingID)
	}

	// if user is authenticated and current listing is in user's wishlist -> isInWishlist = true
	isInWishlist := false
	if userExists {
		var count int64
		database.DB.Model(&models.WishlistListing{}).
			Where("user_id = ? AND listing_id = ?", userID, listing.ID).
			Count(&count)
		isInWishlist = count > 0
	}

	c.JSON(http.StatusOK, ListingResponse{
		listing,
		isInWishlist,
	})
}

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

	// ex: other user = Dan
	otherUserID := c.Param("id")
	var otherUser models.User

	// get Dan and his listings from database
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

		// if user is authenticated -> determine which Dan's listings are in user's wishlist
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

type SearchParams struct {
	Query    string `form:"query"`
	Page     int    `form:"page" binding:"min=1"`
	Category string `form:"category"`
	// MinPrice float64 `form:"min_price"`
	// MaxPrice float64 `form:"max_price"`
	// Sort     string  `form:"sort"`
}

func Search(c *gin.Context) {
	// 1. Get the query
	var params SearchParams
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Retrieve the paginated resources from DB
	const limit int = 10
	offset := (params.Page - 1) * limit

	var listings []models.Listing

	query := database.DB.Model(&models.Listing{})

	if params.Query != "" {
		searchPattern := "%" + params.Query + "%"
		query = query.Where(
			"title ILIKE ? OR description ILIKE ?",
			searchPattern, searchPattern,
		)
	}

	if params.Category != "" {
		query = query.Where("LOWER(category) = LOWER(?)", params.Category)
	}

	if err := query.Limit(limit).Offset(offset).Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}

	// 3. Check if user is authenticated
	userAny, exists := c.Get("user")
	if !exists {
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

	// 4. Get wishlisted listing IDs
	user := userAny.(models.User)
	listingIDs := make([]uint, len(listings))
	for i, listing := range listings {
		listingIDs[i] = listing.ID
	}

	// Single query to get all wishlisted IDs
	var wishlistedIDs []uint
	database.DB.Model(&models.WishlistListing{}).
		Where("user_id = ? AND listing_id IN ?", user.ID, listingIDs).
		Pluck("listing_id", &wishlistedIDs)

	wishlistMap := make(map[uint]bool)
	for _, id := range wishlistedIDs {
		wishlistMap[id] = true
	}

	// 5. Build response with wishlist status
	var response []ListingResponse
	for _, listing := range listings {
		response = append(response, ListingResponse{
			Listing:      listing,
			IsInWishlist: wishlistMap[listing.ID],
		})
	}

	c.JSON(http.StatusOK, response)
}
