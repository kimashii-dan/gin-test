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
  listing?: Listing[];
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
};

export type GetListingResponseType = {
  is_in_wishlist: boolean;
  listing: Listing;
};
