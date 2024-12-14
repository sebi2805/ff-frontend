import { User } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterValidationErrors {
  email?: string;
  name?: string;
  password?: string;
  passwordConfirm?: string;
  location?: string;
}

export interface UserRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface GymRegisterPayload {
  name: string;
  email: string;
  password: string;
  location: string;
}

export interface VerifyTokenPayload {
  email: string;
  token: number;
}
