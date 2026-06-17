export interface AppNotification {
  id: string;
  user_id?: string;      // null nếu là thông báo hệ thống toàn cục
  title: string;
  content: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  is_read: boolean;
  link_url?: string;     // Click vào thông báo dẫn đến trang hóa đơn/phim
  created_at: string;
}