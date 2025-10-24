export interface RegisterRequest {
  email: string;
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface RegisterResponse {
  success: boolean;
  userId: string;
  tokens: number;
  accessToken: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  success: boolean;
  userId: string;
  accessToken: string;
  message?: string;
}

export interface UserData {
  userId: string;
  email: string;
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  registrationDate: string;
}

export interface MeResponse {
  success: boolean;
  user: UserData;
}

export interface BalanceResponse {
  success: boolean;
  tokens: number;
  userId: string;
}

export interface AddTokensRequest {
  email: string;
  amount: number;
  paymentId?: string;
  description?: string;
}

export interface AddTokensResponse {
  success: boolean;
  newBalance: number;
  message?: string;
}

export interface SpendTokensRequest {
  amount: number;
  description?: string;
}

export interface SpendTokensResponse {
  success: boolean;
  remainingTokens: number;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}
