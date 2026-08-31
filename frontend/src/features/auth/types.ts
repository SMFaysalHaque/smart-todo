
export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  id: string;
  email: string;
}
