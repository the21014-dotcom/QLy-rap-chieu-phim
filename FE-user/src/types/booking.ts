// 1. Định nghĩa các Enum để khớp với Database (Upper Case)
export type SeatType = "STANDARD" | "VIP" | "COUPLE";
export type SeatStatus = "AVAILABLE" | "BOOKED" | "SOLD";
export type BookingStatus = "PENDING" | "PAID" | "CANCELLED";

export interface Seat {
  id: number; // ID thường là number trong MySQL
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  price_extra: number; // Quan trọng: Để cộng vào giá base của suất chiếu
}

// 2. Cập nhật Food (thay cho Combo) để khớp với bảng Food trong DB
export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string; // Khớp với trường image_url backend thường dùng
  is_available: boolean;
}

export interface SelectedFood {
  food_id: number;
  name: string;
  price: number;
  quantity: number;
}
export interface ShowtimeResponse {
  data: ShowtimeDetails; // Giả sử Backend bọc dữ liệu trong field 'data'
  message?: string;
  status?: number;
}
// 3. Chi tiết suất chiếu bao gồm thông tin phim và phòng
export interface ShowtimeDetails {
  id: number;
  movie_id: number;
  room_id: number;
  price_base: number; // Giá gốc của suất chiếu
  start_time: string;
  movie: {
    title: string;
    duration: number;
    poster_url: string;
  };
  room: {
    name: string;
    cinema: {
      name: string;
      address: string;
    };
  };
  seats: Seat[]; // Danh sách ghế kèm trạng thái thực tế cho suất chiếu này
}
export interface BaseResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// 4. Payload gửi lên Backend khi đặt vé (DTO)
export interface CreateBookingPayload {
  showtime_id: number;
  seat_ids: number[];
  foods: {
    food_id: number;
    quantity: number;
  }[];
  promotion_code?: string;
}

// 5. Interface cho lịch sử đặt vé (Ticket/Booking History)
export interface BookingHistory {
  id: number;
  total_amount: number;
  status: BookingStatus;
  created_at: string;
  showtime: {
    movie: { title: string };
    room: { 
      name: string;
      cinema: { name: string };
    };
    start_time: string;
  };
  tickets: {
    seat: { row: string; number: number };
    price: number;
  }[];
}