export type Credentials = {
  email: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
};

export type SuccessResponse = {
  success: true;
};

export type AuthResponse = {
  user: User;
};

export type Theme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export type AuthState = {
  isAuthenticated: boolean;
  user?: User;
};

export type ServerError = {
  response: {
    data: {
      error: string;
    };
    status: number;
    statusText: string;
  };
  config: {
    data: string;
    url: string;
  };
};

export type User = {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  university: string;
  name: string;
  phone: string;
  telegram_link: string;
  bio: string;
  avatar_url: string;
  average_rating: number;
  rating_count: number;
  listings?: ListingData[];
};

export type Listing = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  title: string;
  description: string;
  category: string;
  image_urls: string[];
  price: number;
  is_closed: boolean;
  user?: User;
  ai_price_report?: PriceSuggestionResponse;
};

export type ListingData = {
  listing: Listing;
  is_in_wishlist: boolean;
};

export type PriceSuggestionResponse = {
  id?: number;
  suggested_price_min: number;
  suggested_price_max: number;
  confidence_level: "low" | "medium" | "high";
  currency: string;
  reasoning: string;
};

export type SearchParams = {
  page: number;
  query?: string;
  category?: string;
};

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

export type RatingResponse = {
  ratings: Rating[];
  average_rating: number;
  rating_count: number;
};

export type CheckRatingResponse = {
  has_rated: boolean;
  rating: Rating | null;
};
