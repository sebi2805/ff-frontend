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
  email: string;
  password: string;
}
