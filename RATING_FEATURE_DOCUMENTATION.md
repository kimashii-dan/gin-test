# Seller Rating Feature - Implementation Guide

## Overview

This document describes the implementation of the seller rating feature that allows users to rate and review sellers after viewing their listings.

## Backend Implementation

### 1. Database Schema

#### Ratings Table (Migration 000008)

```sql
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rater_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    UNIQUE(user_id, rater_id, listing_id)
);
```

#### User Table Updates (Migration 000009)

```sql
ALTER TABLE users ADD COLUMN average_rating DOUBLE PRECISION DEFAULT 0;
ALTER TABLE users ADD COLUMN rating_count INTEGER DEFAULT 0;
```

### 2. Models

#### Rating Model (`internal/models/rating.go`)

- ID, UserID (seller), RaterID (buyer), Rating (1-5), Comment, ListingID
- Relationships with User and Listing models

#### Updated User Model

- Added `AverageRating` and `RatingCount` fields
- Added `Ratings` relationship

### 3. API Endpoints

#### Protected Routes (requires authentication)

- `POST /user/ratings` - Create a new rating
- `GET /user/ratings/given` - Get ratings given by current user
- `PATCH /user/ratings/:id` - Update an existing rating
- `DELETE /user/ratings/:id` - Delete a rating

#### Public Routes

- `GET /public/ratings/user/:id` - Get all ratings for a specific user
- `GET /public/ratings/check/:sellerId` - Check if current user has rated a seller

### 4. Handlers (`internal/handlers/rating.go`)

#### CreateRating

- Validates that users can't rate themselves
- Prevents duplicate ratings for the same seller/listing combination
- Automatically updates seller's average rating and count

#### GetUserRatings

- Returns all ratings for a specific user with related data (rater, listing)
- Includes average rating and total count

#### UpdateRating

- Only the rater can update their own rating
- Recalculates seller's average rating

#### DeleteRating

- Only the rater can delete their own rating
- Recalculates seller's average rating

#### CheckUserRating

- Checks if current user has already rated a specific seller
- Supports filtering by listing_id

## Frontend Implementation

### 1. Types (`shared/types.ts`)

```typescript
export type Rating = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  rater_id: number;
  listing_id?: number;
  rating: number;
  comment: string;
  user?: User;
  rater?: User;
  listing?: Listing;
};

export type CreateRatingDTO = {
  user_id: number;
  rating: number;
  comment: string;
  listing_id?: number;
};

export type UpdateRatingDTO = {
  rating: number;
  comment: string;
};
```

### 2. API Functions (`shared/api.ts`)

- `createRating(ratingData)` - Create a new rating
- `getUserRatings(userId)` - Get all ratings for a user
- `getMyRatingsGiven()` - Get ratings given by current user
- `updateRating(ratingId, ratingData)` - Update a rating
- `deleteRating(ratingId)` - Delete a rating
- `checkUserRating(sellerId, listingId?)` - Check if user has rated seller

### 3. UI Components

#### RatingStars (`shared/ui/rating-stars`)

- Reusable star display component
- Supports interactive mode for rating input
- Configurable size (small, medium, large)
- Shows rating count optionally

#### RatingModal (`pages/listing/ui/rating-modal`)

- Modal for creating/updating ratings
- Star rating input
- Comment textarea
- Form validation
- Handles both create and update operations

#### UserRatings (`pages/profile/ui/user-ratings`)

- Displays all ratings for a user
- Shows average rating with stars
- Lists individual ratings with rater info and comments
- Links to related listings

### 4. Page Integrations

#### Listing Details Page

- Shows "Rate Seller" button for authenticated users (not the owner)
- Button changes to "Update Your Rating" if already rated
- Opens RatingModal on click
- Checks existing rating status on load

#### Profile Page (Own Profile)

- Displays UserRatings component showing received ratings
- Shows average rating and count in user info

#### Account Page (Public Profile)

- Displays UserRatings component for viewing others' ratings
- Shows average rating in account details

### 5. Internationalization

Added translations for English and Russian:

- Rating-related button labels
- Modal text and placeholders
- Rating display text
- Error messages

### 6. Styling

#### CSS Variables

Added `--warning` color for star ratings:

- Light mode: `oklch(0.75 0.15 85)`
- Dark mode: `oklch(0.78 0.15 85)`

#### Modal Styles

- Overlay with backdrop blur
- Slide-in animation
- Centered positioning
- Click-outside-to-close functionality
- ESC key support

## Features

### Core Functionality

1. **Rate Sellers**: Users can rate sellers from 1-5 stars
2. **Add Comments**: Optional text comments with ratings
3. **Update Ratings**: Users can edit their previously submitted ratings
4. **Delete Ratings**: Users can remove their ratings
5. **View Ratings**: Public display of all ratings on user profiles
6. **Average Rating**: Automatic calculation and display of average ratings
7. **Rating Count**: Display total number of ratings received

### Business Logic

- Users cannot rate themselves
- One rating per seller/listing combination
- Only raters can update/delete their own ratings
- Ratings are tied to listings (optional)
- Average ratings update automatically on create/update/delete

### UI/UX Features

- Star rating input with hover effects
- Visual feedback for filled/unfilled stars
- Responsive design for mobile and desktop
- Loading states during API calls
- Error handling and user feedback
- Smooth animations and transitions

## Usage Flow

1. **User views a listing** from another seller
2. **Clicks "Rate Seller"** button
3. **Modal opens** with star rating and comment field
4. **User selects stars** (1-5) and optionally adds comment
5. **Submits rating** - data is saved and seller's average updates
6. **Rating appears** on seller's profile page
7. **User can update** their rating by clicking button again
8. **User can view** all ratings on seller's profile

## Testing Recommendations

### Backend Testing

- Test rating creation with valid/invalid data
- Test duplicate rating prevention
- Test rating update/delete permissions
- Test average rating calculations
- Test cascade deletes when user/listing is deleted

### Frontend Testing

- Test modal open/close functionality
- Test star rating selection
- Test form validation
- Test API error handling
- Test responsive design
- Test internationalization

## Database Indexes

Created indexes for optimal query performance:

- `idx_ratings_user_id` - For getting seller ratings
- `idx_ratings_rater_id` - For getting rater's given ratings
- `idx_ratings_listing_id` - For listing-specific ratings

## Security Considerations

1. Authentication required for creating/updating/deleting ratings
2. Authorization checks ensure users only modify their own ratings
3. Input validation on rating values (1-5 range)
4. SQL injection prevention through parameterized queries
5. XSS prevention through proper data escaping

## Future Enhancements

Potential improvements:

- Rating photos/evidence
- Verified purchase badges
- Rating helpfulness votes
- Seller response to ratings
- Rating categories (communication, delivery, etc.)
- Rating appeals/disputes
- Email notifications for new ratings
- Rating analytics dashboard
