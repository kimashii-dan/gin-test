package handlers

import (
	"gin-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)


func Validate(c *gin.Context) {
    userAny, exists := c.Get("user")
    if !exists {
        c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "User not found in context",
		})
        return
    }

    user, ok := userAny.(models.User)
    if !ok {
        c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid user type",
		})
        return
    }

	c.JSON(http.StatusOK, gin.H {
		"userEmail": user.Email,
	})
}