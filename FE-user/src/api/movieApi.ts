import axiosClient from "./axiosClient";
import type { Movie } from "../types/movie";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Định nghĩa interface cho các tham số lọc để code chặt chẽ hơn
export interface MovieQueryParams {
  status?: "now_showing" | "coming_soon";
  genre?: string;
  is_active?: boolean;
}

export const movieApi = {
  /**
   * LẤY DANH SÁCH PHIM (CLIENT & ADMIN)
   * @param params Bao gồm status (now_showing/coming_soon) hoặc genre
   */
  getAll: (params?: MovieQueryParams): Promise<Movie[]> =>
    axiosClient.get("/movies", { params }),

  /**
   * LẤY CHI TIẾT PHIM
   */
  getDetail: (id: string | number): Promise<Movie> =>
    axiosClient.get(`/movies/${id}`),

  /**
   * TẠO MỚI PHIM (ADMIN)
   */
  create: (data: Partial<Movie>): Promise<Movie> =>
    axiosClient.post("/movies", data),

  /**
   * CẬP NHẬT THÔNG TIN PHIM (ADMIN)
   */
  update: (id: string | number, data: Partial<Movie>): Promise<Movie> =>
    axiosClient.patch(`/movies/${id}`, data),

  /**
   * XÓA PHIM (ADMIN)
   */
  delete: (id: string | number): Promise<any> =>
    axiosClient.delete(`/movies/${id}`),
  
  getFeedbacks: (movieId: string | number) => axiosClient.get(`/feedbacks/movie/${movieId}`),
postFeedback: (data: any) => axiosClient.post('/feedbacks', data),

  /**
   * UPLOAD HÌNH ẢNH (POSTER & LANDSCAPE)
   * Sử dụng FormData để gửi file lên NestJS
   */
  uploadImages: (id: string | number, formData: FormData): Promise<Movie> =>
    axiosClient.post(`/movies/${id}/upload-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  /**
   * CÁC API BỔ TRỢ KHÁC (NẾU CẦN)
   */
  
  // Lấy phim đang chiếu (gọi trực tiếp endpoint riêng nếu không dùng query params)
  getNowShowing: (): Promise<Movie[]> => 
    axiosClient.get("/movies/now-showing"),

  // Lấy phim sắp chiếu
  getUpcoming: (): Promise<Movie[]> => 
    axiosClient.get("/movies/upcoming"),

  // Lấy top phim (cho bảng xếp hạng)
  getTopBoxOffice: (): Promise<Movie[]> => 
    axiosClient.get("/movies/top-box-office"),
};