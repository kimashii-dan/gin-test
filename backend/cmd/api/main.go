package main

import (
	"gin-backend/internal/database"
	"gin-backend/internal/handlers"
	"gin-backend/internal/middleware"
	"gin-backend/internal/services"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using environment variables")
	}

	database.Connect()
	database.InitR2()
	services.InitGemini()

	router := gin.Default()

	router.MaxMultipartMemory = 8 << 20

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:4173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	{
		auth := router.Group("/auth")
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
		auth.POST("/refresh", handlers.Refresh)
		auth.POST("/logout", handlers.Logout)
	}

	{
		// user CRUD
		user := router.Group("/user", middleware.CheckAuth())
		user.GET("", handlers.GetUser)
		user.PATCH("", handlers.UpdateUser)
		user.DELETE("", handlers.DeleteUser)
		user.PATCH("/avatar", handlers.UploadAvatar)

		{
			// user's listing CRUD
			listing := user.Group("/listings")
			listing.GET("", handlers.GetMyListings)
			listing.POST("", handlers.CreateListing)
			listing.PATCH("/:id", handlers.UpdateListing)
			listing.DELETE("/:id", handlers.DeleteListing)
			listing.POST("/wishlist/:id", handlers.ToggleWishlist)
			listing.GET("/wishlist", handlers.GetListingsFromWishlist)
			listing.POST("/report/:id", handlers.CreateAIReport)
		}
	}

	{
		// public routes
		public := router.Group("/public")
		{
			listing := public.Group("/listings")
			listing.GET("", middleware.OptionalAuth(), handlers.GetListings)
			listing.GET("/:id", middleware.OptionalAuth(), handlers.GetListing)
		}

		{
			user := public.Group("/users")
			user.GET("/:id", middleware.OptionalAuth(), handlers.GetUserWithListing)
		}
	}

	{
		ai := router.Group("/ai", middleware.CheckAuth())
		ai.GET("/health-check", handlers.HealthCheckGemini)
		ai.POST("/suggest-price", handlers.AskAIAboutPrice)
	}

	router.Run(":8080")
}
