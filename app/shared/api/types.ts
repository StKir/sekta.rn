export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface TariffInfo {
  status: 'TRIAL' | 'PRO';
  trialCount?: number;
}

export interface RegisterResponseUser {
  email: string;
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  registrationDate?: string;
  tariff_info?: TariffInfo;
}

export interface RegisterResponse {
  token: string;
  user: RegisterResponseUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: RegisterResponseUser;
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
  user: RegisterResponseUser;
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

export interface UpdateUserRequest {
  name?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  about_me?: string;
  feeling?: string;
  stress_level?: string;
  bad_habits?: string;
  tracking_goals?: string[];
  app_experience?: string;
  communication_style?: string;
  [key: string]: any;
}

export interface UpdateUserResponse {
  user: RegisterResponseUser;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
}
