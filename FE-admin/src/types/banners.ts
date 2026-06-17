export interface Banner {
  id: number;
  title: string;
  image_url: string;
  movie_id?: number | null;
  is_active: boolean;
  type: 'MOVIE' | 'PROMOTION' | 'EVENT'; 
  position: 'HOME_SLIDER' | 'SIDEBAR' | 'POPUP';
  priority: number; // Đổi từ order thành priority để khớp DB
  target_link?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}