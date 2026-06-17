export interface Genre {
  id: number;
  name: string;
  description?: string; // Prisma chưa có nhưng UI đang dùng, có thể bổ sung sau
  movie_count?: number; // Trường ảo (computed field) từ backend trả về
}