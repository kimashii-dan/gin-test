package handlers

import (
	"encoding/json"
	"fmt"
	"gin-backend/internal/services"
	"io"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"google.golang.org/genai"
)

type PriceSuggestionRequest struct {
	Title       string                  `form:"title" binding:"required"`
	Description string                  `form:"description" binding:"required"`
	Images      []*multipart.FileHeader `form:"images[]" binding:"required"`
	// ImageUrls   []string                `form:"image_urls[]"`
}

type PriceSuggestionResponse struct {
	SuggestedPriceMin float64 `json:"suggested_price_min"`
	SuggestedPriceMax float64 `json:"suggested_price_max"`
	ConfidenceLevel   string  `json:"confidence_level"`
	Currency          string  `json:"currency"`
	Reasoning         string  `json:"reasoning"`
}

func SuggestPrice(c *gin.Context) {
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
	log.Printf("Here's the body: %+v", body)

	// validate body data
	if strings.TrimSpace(body.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
		return
	}

	if len(body.Images) < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Listing must have at least 1 image"})
		return
	}

	// create text prompt
	parts := []*genai.Part{
		{Text: fmt.Sprintf(
			`Analyze this listing and predict a fair market price based on the following information:
			Title: %s
			Description: %s

			Based on the images provided and the description, please perform a brief and highly targeted analysis.

			1. Assess the condition and quality (implied from images/description).
			2. Consider market demand and prices of comparable items.
			3. Provide a price range with justification.

			Please respond **strictly in JSON format**. Ensure the output is **maximal clarity with short length**.

			{
				"suggested_price_min": "<The lowest fair selling price as a numeric value.>",
				"suggested_price_max": "<The highest fair selling price as a numeric value.>",
				"currency": "<The currency used for the prices (e.g., USD).>",
				"confidence_level": "<Assessment of prediction certainty: 'high' (complete information, clear comps), 'medium' (average information), or 'low' (missing images/details, volatile market).>",
				"reasoning": "<A single, concise sentence (max 50 words) summarizing the 2-3 **primary factors** that directly drove the suggested price range.>"
			}`,
			body.Title, body.Description)},
	}

	// loop through each image
	for _, fileHeader := range body.Images {
		// open image
		file, err := fileHeader.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to open image file"})
			return
		}
		defer file.Close()

		// read image bytes
		imageBytes, err := io.ReadAll(file)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read image file"})
			return
		}

		// determine image extension
		ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
		mimeType := mime.TypeByExtension(ext)
		if mimeType == "" || !strings.HasPrefix(mimeType, "image/") {
			mimeType = "image/jpeg"
		}

		// add image data to the prompt
		parts = append(parts, &genai.Part{
			InlineData: &genai.Blob{
				Data:     imageBytes,
				MIMEType: mimeType,
			},
		})
	}

	// generate content
	ctx := c.Request.Context()
	result, err := services.AI.Models.GenerateContent(
		ctx,
		services.GeminiModel,
		[]*genai.Content{{Parts: parts}},
		&genai.GenerateContentConfig{
			ResponseMIMEType: "application/json",
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate price prediction"})
		return
	}

	// stringify content
	responseText := result.Text()
	if responseText == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No response generated"})
		return
	}

	// bind content into response
	var pricePredictionResponse PriceSuggestionResponse
	if err := json.Unmarshal([]byte(responseText), &pricePredictionResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response"})
		return
	}

	log.Println(pricePredictionResponse)

	c.JSON(http.StatusOK, pricePredictionResponse)
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
