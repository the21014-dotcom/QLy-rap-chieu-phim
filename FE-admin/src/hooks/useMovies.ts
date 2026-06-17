/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { movieApi } from '../services/movieApi';
import type { Movie } from '../types/movie';

// Định nghĩa các tham số lọc khớp với query của Prisma
interface MovieFilters {
  is_active?: boolean;
  genre_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const useMovies = (initialFilters: MovieFilters = { page: 1, limit: 10 }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0); // Dùng cho phân trang Table Antd
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MovieFilters>(initialFilters);

  const getMovies = useCallback(async () => {
    setLoading(true);
    try {
      // movieApi.getAll nên nhận params để Prisma thực hiện lọc ở phía Server
      const response: any = await movieApi.getAll(filters);
      
      // Giả định backend trả về { data: Movie[], total: number }
      if (response?.data) {
        setMovies(response.data);
        setTotal(response.total || response.data.length);
      } else {
        setMovies(response); // Trường hợp API chỉ trả về mảng trực tiếp
      }
    } catch (err) {
      console.error("Fetch Movies Error:", err);
      message.error("Hệ thống không thể tải danh sách phim hiện tại");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Hàm để cập nhật bộ lọc từ UI (ví dụ: khi nhấn chuyển tab Đang chiếu/Sắp chiếu)
  const updateFilters = (newFilters: Partial<MovieFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset về trang 1 khi lọc
  };

  // Hàm xóa phim (Delete logic khớp với ID của Prisma)
  const deleteMovie = async (id: string) => {
    try {
      await movieApi.delete(id.toString()); 
      message.success("Đã xóa phim khỏi hệ thống hành công");
      getMovies(); // Refresh lại danh sách
      return true;
    } catch (err: any) {
      console.error("Delete Movie Error:", err); 
      const errorMsg = err.response?.data?.message || "Xóa phim thất bại";
      message.error(errorMsg);
      return false;
    }
  };

  useEffect(() => { 
    getMovies(); 
  }, [getMovies]);

  return { 
    movies, 
    total,
    loading, 
    filters,
    updateFilters,
    deleteMovie,
    refresh: getMovies 
  };
};