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


func main(){
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using environment variables")
	}
	
	database.Connect()

	router := gin.Default()
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))

	{
		auth := router.Group("/auth")
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
		auth.POST("/refresh", handlers.Refresh)
		auth.POST("/logout", handlers.Logout)
	}

	{
		user := router.Group("/user")
		user.GET("me", middleware.CheckAuth(), handlers.GetUser)
		user.PATCH("me", middleware.CheckAuth(), handlers.UpdateUser)
		user.DELETE("me", middleware.CheckAuth(), handlers.DeleteUser)
	}

  	router.Run(":8080")
}