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
		user.GET("/dashboard", handlers.GetDashboard)

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

		{
			// user's ratings
			ratings := user.Group("/ratings")
			ratings.POST("", handlers.CreateRating)
			ratings.GET("/given", handlers.GetMyRatingsGiven)
			ratings.PATCH("/:id", handlers.UpdateRating)
			ratings.DELETE("/:id", handlers.DeleteRating)
		}
	}

	{
		// public routes
		public := router.Group("/public")
		{
			listings := public.Group("/listings")
			listings.GET("/search", middleware.OptionalAuth(), handlers.Search)
			listings.GET("", middleware.OptionalAuth(), handlers.GetListings)
			listings.GET("/:id", middleware.OptionalAuth(), handlers.GetListing)

		}

		{
			user := public.Group("/users")
			user.GET("/:id", middleware.OptionalAuth(), handlers.GetUserWithListing)
		}

		{
			ratings := public.Group("/ratings")
			ratings.GET("/user/:id", handlers.GetUserRatings)
			ratings.GET("/check/:sellerId", middleware.OptionalAuth(), handlers.CheckUserRating)
		}
	}

	{
		ai := router.Group("/ai", middleware.CheckAuth())
		ai.GET("/health-check", handlers.HealthCheckGemini)
		ai.POST("/suggest-price", handlers.AskAIAboutPrice)
	}

	{
		// admin routes
		adminAuth := router.Group("/admin/auth")
		adminAuth.POST("/login", handlers.AdminLogin)

		admin := router.Group("/admin", middleware.CheckAdminAuth())
		admin.GET("/users", handlers.GetAllUsers)
		admin.GET("/listings", handlers.GetAllListings)
		admin.DELETE("/users/:id", handlers.AdminDeleteUser)
		admin.DELETE("/listings/:id", handlers.AdminDeleteListing)
	}

	router.Run(":8080")
}
