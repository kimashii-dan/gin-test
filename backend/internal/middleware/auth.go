package middleware

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func CheckAuth() gin.HandlerFunc {
	return func(c *gin.Context) {

		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H {
				"error": "Missing access token",
			})

			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H {
				"error": "Invalid access token",
			})

			return
		}

	

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			sub, ok := claims["sub"].(float64)
			if !ok {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "Invalid user ID in token",
				})
				return
			}
			var user models.User
			result := database.DB.First(&user, uint(sub))

			if result.Error != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H {
					"error": "User not found",
				})
				return 
			}

			c.Set("user", user)

			c.Next()

		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H {
				"error": "Invalid token claims",
			})

			return
		}
	}
}