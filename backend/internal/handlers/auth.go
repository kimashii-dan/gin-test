package handlers

import (
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	Email    string
	Password string
}

func Register(c *gin.Context) {
	var body Credentials

	if c.ShouldBindJSON(&body) != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// check if user already exists
	var existing models.User
	if database.DB.First(&existing, "email = ?", body.Email).Error == nil {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"error": "User already exists",
		})
		return
	}

	// hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	user := models.User{Email: body.Email, Password: string(hash)}

	// create user in db
	result := database.DB.Create(&user)

	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"user":    user,
	})
}

func Login(c *gin.Context) {

	var body Credentials
	if c.ShouldBindJSON(&body) != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// check if user exists
	var user models.User
	result := database.DB.First(&user, "email = ?", body.Email)
	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	// compare passwords: input and db
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	// generate access token
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Minute * 15).Unix(),
	})
	signedAccess, err := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create token",
		})
		return
	}

	// generate refresh token
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 15).Unix(),
	})
	signedRefresh, err := refreshToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create token",
		})
		return
	}

	// set refrehs token to the cookies
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("refreshToken", signedRefresh, 60*60*24*15, "", "", false, true)

	// return access token to the frontend
	c.JSON(http.StatusOK, gin.H{
		"accessToken": signedAccess,
	})
}

func Refresh(c *gin.Context) {
	// get token from cookies
	tokenString, err := c.Cookie("refreshToken")

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "No refresh token",
		})
		return
	}

	// validate token with secret word
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid or expired token",
		})
		return
	}

	// get token's content
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token claims",
		})
		return
	}

	// get token's property - sub: userID
	sub, ok := claims["sub"].(float64)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user ID in token",
		})
		return
	}

	// find user by id (sub)
	var user models.User
	result := database.DB.First(&user, uint(sub))

	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "User not found",
		})
		return
	}

	// generate access token
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Minute * 15).Unix(),
	})
	signedAccess, err := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create token",
		})
		return
	}

	// return access token to the frontend
	c.JSON(http.StatusOK, gin.H{
		"accessToken": signedAccess,
	})
}

func Logout(c *gin.Context) {
	// delete refresh token
	c.SetCookie("refreshToken", "", -1, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}
