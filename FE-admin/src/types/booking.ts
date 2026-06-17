
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Booking {
  id: number;
  total_amount: number;
  status: string;
  user: {
    full_name: string;
    email: string;
    phone?: string;
  };
  showtime: {
    movie: { title: string };
    room: { 
      name: string;
      cinema: { name: string };
    };
    start_time: string;
  };
  tickets: any[];
  booking_foods: any[];
  promotion?: any;
  payment?: any;
}
