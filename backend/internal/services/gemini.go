package services

import (
	"context"
	"fmt"
	"log"
	"os"

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
