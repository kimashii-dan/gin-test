package main

import (
	"gin-backend/internal/database"
	"gin-backend/internal/handlers"
	"gin-backend/internal/middleware"
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

	router := gin.Default()

	router.MaxMultipartMemory = 8 << 20

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
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
		user.GET("/me", handlers.GetUser)
		user.PATCH("/me", handlers.UpdateUser)
		user.DELETE("/me", handlers.DeleteUser)
		user.PATCH("/avatar", handlers.UploadAvatar)

		{
			// user's listing CRUD
			listing := user.Group("/listings")
			listing.GET("", handlers.GetMyListings)
			listing.POST("", handlers.CreateListing)
			listing.PATCH("/:id", handlers.UpdateListing)
			listing.DELETE("/:id", handlers.DeleteListing)
		}
	}

	{
		public := router.Group("/public", middleware.CheckAuth())
		{
			listing := public.Group("/listings")
			listing.GET("", handlers.GetListings)
			listing.GET("/:id", handlers.GetListing)
		}
	}

	router.Run(":8080")
}
