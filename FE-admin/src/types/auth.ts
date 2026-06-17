import type { IRole } from "./permission";

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface IUser {
  id: string | number;
  email: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  role_id: number | null;
  role?: IRole;
  //loyalty_points: number;
  is_verified: boolean;

  created_at: string;
  updated_at: string;
  _count?: {
    bookings: number;
  };
}
export interface CreateUserDto {
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  roleName: 'CUSTOMER' | 'STAFF' | 'ADMIN'; // Khớp với logic trong UserList.tsx
  is_verified?: boolean;
}
export interface UpdateUserDto extends Partial<CreateUserDto> {
  avatar_url?: string;
}

export interface AuthResponse {
  user: IUser;
  access_token: string;
  refresh_token: string;
}


