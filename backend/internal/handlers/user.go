package handlers

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateUser(c *gin.Context) {
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

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Model(&user).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func DeleteUser(c *gin.Context) {
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


	if err := database.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": "true",
	})
}

func GetUser(c *gin.Context) {
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
		"user": user,
	})
}