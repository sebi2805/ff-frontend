export type UserRole = "Admin" | "GymOwner" | "NormalUser";

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface GetUserAdminDto {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  location?: string | null;
  fitnessPlan?: string | null;
  role: string;
  isVerified: boolean;
}

export interface UserSettingsPayload {
  name?: string;
  location?: string;
  password?: string;
  fitnessPlan?: number;
}

export interface UserSettings {
  location: string | null;
  fitnessPlan: string | null;
  name: string;
  email: string;
}
