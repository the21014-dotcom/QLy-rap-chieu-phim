export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface Admin {
  id: number;          // Prisma @id @default(autoincrement()) là number
  email: string;
  full_name: string;
  role: Role;
  avatar_url?: string; // SỬA: dùng avatar_url cho khớp với DB
  username?: string;
}