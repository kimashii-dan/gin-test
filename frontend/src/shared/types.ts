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
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
};
