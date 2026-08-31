// Shapes returned by the backend auth endpoints.

export interface AuthUser {
  id: string;
  email: string;
}

// POST /auth/login
export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// POST /auth/register
export interface RegisterResponse {
  id: string;
  email: string;
}
