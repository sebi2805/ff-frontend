import { User } from "./user";

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterValidationErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyTokenPayload {
  email: string;
  token: number;
}
