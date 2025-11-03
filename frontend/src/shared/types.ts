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
  listings?: ListingData[];
};

export type Listing = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  title: string;
  description: string;
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

// type PriceSuggestionResponse struct {
// 	SuggestedPriceMin float64 `json:"suggested_price_min"`
// 	SuggestedPriceMax float64 `json:"suggested_price_max"`
// 	ConfidenceLevel   string  `json:"confidence_level"`
// 	Currency          string  `json:"currency"`
// 	Reasoning         string  `json:"reasoning"`
// }
