# AI-Powered Student Marketplace with Price Advisor

## Overview

This project is an intelligent student marketplace designed for buying and selling second-hand goods. It features an AI-powered Price Advisor to help sellers price their items competitively and a trust system to ensure safe transactions.

## Features

- **User Authentication:** Secure user registration and login system using JWT.
- **Listings Management:** Users can create, view, update, and delete their product listings.
- **AI Price Advisor:** Utilizes Google's Gemini AI to suggest optimal pricing for items based on their title, description, and category.
- **Seller Trust System:** A rating and review system allows users to build trust within the community.
- **Wishlist:** Users can save items they are interested in to a personal wishlist.
- **Search & Discovery:** Easily search for listings and browse through categories.
- **User Profiles:** Public user profiles display user information and their listings.
- **Dashboard:** A personal dashboard for users to manage their listings and view their sales activity.
- **Admin Panel:** A separate interface for administrators to manage users and listings on the platform.
- **Image Uploads:** Users can upload avatars and listing images, which are stored using a cloud service (like AWS S3).

## Tech Stack

### Backend

- **Language:** Go (v1.25.1)
- **Framework:** Gin
- **ORM:** GORM
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **AI:** Google Gemini
- **File Storage:** AWS S3 (or compatible like Cloudflare R2)
- **Migrations:** `golang-migrate`

### Frontend

- **Framework:** React (v19)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query & Axios
- **Routing:** React Router
- **Form Management:** React Hook Form
- **Schema Validation:** Zod

## Getting Started

### Prerequisites

- Go (v1.25 or later)
- Node.js (v20 or later)
- Docker & Docker Compose (for PostgreSQL) or a running PostgreSQL instance
- Access keys for Google Gemini and an S3-compatible object storage service.

### Backend Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd gin-test/backend
    ```

2.  **Create an environment file:**
    Create a `.env` file in the `backend` directory by copying the `.env.example` (if available) or creating it from scratch. Fill in the necessary environment variables:

    ```env
    DB_SOURCE="postgresql://user:password@localhost:5432/database_name?sslmode=disable"
    JWT_SECRET="your_jwt_secret"
    GEMINI_API_KEY="your_gemini_api_key"
    R2_ACCESS_KEY_ID="your_s3_access_key"
    R2_SECRET_ACCESS_KEY="your_s3_secret_key"
    R2_ENDPOINT="your_s3_endpoint"
    R2_BUCKET_NAME="your_s3_bucket_name"
    ```

3.  **Install dependencies:**

    ```bash
    go mod tidy
    ```

4.  **Run database migrations:**
    You'll need `golang-migrate` installed.

    ```bash
    migrate -database ${DB_SOURCE} -path internal/database/migrations up
    ```

5.  **Run the server:**
    ```bash
    go run cmd/api/main.go
    ```
    The backend server will start on `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend development server will start on `http://localhost:5173`.

## API Endpoints

The backend exposes a RESTful API with the following main groups:

- `/auth/*` - User Registration and Login
- `/user/*` - User Profile, Listings, Wishlist, and Ratings Management
- `/public/*` - Publicly accessible data (Listings, User Profiles)
- `/ai/*` - AI-powered services like price suggestions
- `/admin/*` - Admin-only routes for platform management

## Project Structure

The project is organized into two main folders:

- `backend/`: Contains the Go server-side application.
  - `cmd/api/`: The main entry point of the application.
  - `internal/`: Contains the core application logic, including database, handlers, models, and services.
  - `go.mod`: Manages backend dependencies.
- `frontend/`: Contains the React client-side application.
  - `src/`: The main source code for the React app.
  - `src/pages/`: Contains the main pages of the application.
  - `src/shared/`: Contains shared components, hooks, and utilities.
  - `package.json`: Manages frontend dependencies.
