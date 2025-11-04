package handlers

import (
	"gin-backend/internal/services"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"google.golang.org/genai"
)

type PriceSuggestionRequest struct {
	Title       string                  `form:"title" binding:"required"`
	Description string                  `form:"description" binding:"required"`
	Images      []*multipart.FileHeader `form:"images[]"`
	ImageUrls   []string                `form:"image_urls[]"`
}

type PriceSuggestionResponse struct {
	SuggestedPriceMin float64 `json:"suggested_price_min"`
	SuggestedPriceMax float64 `json:"suggested_price_max"`
	ConfidenceLevel   string  `json:"confidence_level"`
	Currency          string  `json:"currency"`
	Reasoning         string  `json:"reasoning"`
}

func AskAIAboutPrice(c *gin.Context) {
	ctx := c.Request.Context()

	// check if user is authenticated
	_, exists := c.Get("user")
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "User not found in context",
		})
		return
	}

	// bind body
	var body PriceSuggestionRequest
	if err := c.ShouldBindWith(&body, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// validate body data
	if strings.TrimSpace(body.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
		return
	}

	if len(body.Images) < 1 && len(body.ImageUrls) < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Listing must have at least 1 image"})
		return
	}

	priceSuggestionResponse, err := services.SuggestPrice(ctx, body.Title, body.Description, body.Images, body.ImageUrls)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, priceSuggestionResponse)
}

func HealthCheckGemini(c *gin.Context) {
	ctx := c.Request.Context()

	result, err := services.AI.Models.GenerateContent(
		ctx,
		services.GeminiModel,
		[]*genai.Content{{Parts: []*genai.Part{{Text: "Explain how AI works in a few words"}}}},
		nil,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gemini service unavailable"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Gemini is healthy", "response": result.Text()})
}
