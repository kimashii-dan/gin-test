package services

import (
	"context"
	"fmt"
	"gin-backend/internal/database"
	"gin-backend/internal/models"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)


func UploadImage(ctx context.Context, file *multipart.FileHeader, user *models.User, folder string) (string, error) {
	accountHash := os.Getenv("R2_ACCOUNT_HASH")
	bucketName := os.Getenv("R2_BUCKET_NAME")

	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open uploaded file: %w", err)
	}
	
	defer src.Close()

	buf := make([]byte, 512)
	n, err := src.Read(buf)
	if err != nil && err != io.EOF {
		return "", fmt.Errorf("failed to read file for type detection: %w", err)
	}

	contentType := http.DetectContentType(buf[:n])
	
	if !strings.HasPrefix(contentType, "image/") {
		return "", fmt.Errorf("uploaded file is not an image: %w", err)
	}

	_, err = src.Seek(0, io.SeekStart)
	if err != nil {
		return "", fmt.Errorf("failed to reset file stream: %w", err)
	}

	fileExtension := filepath.Ext(file.Filename)
	key := fmt.Sprintf("%s/%d/%s%s", folder, user.ID, uuid.NewString(), fileExtension)

	_, err = database.S3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(bucketName),
		Key:         aws.String(key),
		Body:        src,
		ContentType: aws.String(contentType),
	})

	if err != nil {
		return "", fmt.Errorf("failed to upload image to storage: %w", err)
	}

	publicURL := fmt.Sprintf("https://pub-%s.r2.dev", accountHash)
	imageURL := fmt.Sprintf("%s/%s", publicURL, key)

	return imageURL, nil
}


func UploadImages(ctx context.Context, files []*multipart.FileHeader, user *models.User, folder string) ([]string, error) {
	var urls []string

	for _, file := range files {
		url, err := UploadImage(ctx, file, user, folder)
		if err != nil {
			return nil, fmt.Errorf("failed to upload %s: %w", file.Filename, err)
		}
		urls = append(urls, url)
	}

	return urls, nil
}


func DeleteImageByURL(ctx context.Context, imageURL string) error {
	if imageURL == "" {
		return nil
	}

	bucketName := os.Getenv("R2_BUCKET_NAME")

	u, err := url.Parse(imageURL)
	if err != nil {
		return fmt.Errorf("invalid image URL: %w", err)
	}

	key := strings.TrimPrefix(u.Path, "/")
	if key == "" {
		return fmt.Errorf("invalid image key")
	}

	_, err = database.S3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(key),
	})
	if err != nil {
		return fmt.Errorf("failed to delete image: %w", err)
	}

	return nil
}
