package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"google.golang.org/genai"
)

var AI *genai.Client
var GeminiModel string

func InitGemini() {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: os.Getenv("GEMINI_API_KEY"),
	})

	GeminiModel = os.Getenv("GEMINI_MODEL")

	if err != nil {
		log.Fatal("Failed to initialize Gemini: ", err)
	}

	AI = client
	fmt.Println("Gemini initialized successfully")
}

type PriceSuggestionResponse struct {
	SuggestedPriceMin float64 `json:"suggested_price_min"`
	SuggestedPriceMax float64 `json:"suggested_price_max"`
	ConfidenceLevel   string  `json:"confidence_level"`
	Currency          string  `json:"currency"`
	Reasoning         string  `json:"reasoning"`
}

func SuggestPrice(ctx context.Context, title string, language string, description string, images []*multipart.FileHeader, imageURLs []string) (PriceSuggestionResponse, error) {
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
			title, description)},
	}

	if len(images) > 0 {
		// loop through each image
		for _, fileHeader := range images {
			// open image
			file, openErr := fileHeader.Open()
			if openErr != nil {
				return PriceSuggestionResponse{}, openErr
			}
			defer file.Close()

			// read image bytes
			imageBytes, readErr := io.ReadAll(file)
			if readErr != nil {
				return PriceSuggestionResponse{}, readErr
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
	} else if len(imageURLs) > 0 {
		for _, imageURL := range imageURLs {
			imageBytes, mimeType, err := GetImageByURL(ctx, imageURL)

			if err != nil {
				return PriceSuggestionResponse{}, err
			}

			parts = append(parts, &genai.Part{
				InlineData: &genai.Blob{
					Data:     imageBytes,
					MIMEType: mimeType,
				},
			})
		}
	}

	// generate content
	result, err := AI.Models.GenerateContent(
		ctx,
		GeminiModel,
		[]*genai.Content{{Parts: parts}},
		&genai.GenerateContentConfig{
			ResponseMIMEType: "application/json",
			SystemInstruction: &genai.Content{
				Parts: []*genai.Part{{
					Text: fmt.Sprintf("You are a pricing assistant. Always respond in %s language. Output must be valid JSON only.", language),
				}},
			},
		},
	)
	if err != nil {
		return PriceSuggestionResponse{}, err
	}

	// stringify content
	responseText := result.Text()
	if responseText == "" {
		return PriceSuggestionResponse{}, err
	}

	// bind content into response
	var priceSuggestionResponse PriceSuggestionResponse
	if err := json.Unmarshal([]byte(responseText), &priceSuggestionResponse); err != nil {
		return PriceSuggestionResponse{}, err
	}

	return priceSuggestionResponse, nil
}
