export type UserRole = "Admin" | "GymOwner" | "NormalUser";

export interface User {
  username: string;
  email: string;
  role: UserRole;
}

export interface GetUserAdminDto {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  location?: string | null;
  role: string;
  isVerified: boolean;
}
