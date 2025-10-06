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

export type User = {
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  university: string;
  name: string;
  phone: string;
  telegram_link: string;
  bio: string;
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
