
export interface Invoice {
  id: number;
  status: 'PENDING' | 'SUCCESS' | 'CANCELLED'; 
  total_amount: number;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  showtime: {
    movie: { title: string };
    room: { 
      name: string;
      cinema: { name: string };
    };
    start_time: string;
  };
  tickets: {
    seat: { row_name: string; seat_number: number };
  }[];
  booking_foods?: {
    quantity: number;
    price: number;
    food: { name: string };
  }[];
}