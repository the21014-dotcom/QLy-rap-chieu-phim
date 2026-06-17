export type TicketStatus = 'BOOKING' | 'SUCCESS' | 'FAILED';

export interface Seat {
  id: number;
  row: string;
  column: number;
  type: 'NORMAL' | 'VIP' | 'SWEETBOX';
}

export interface Ticket {
  id: number;
  price: number;
  status: TicketStatus;
  created_at: string;
  seat?: {
    name: string;
    type: string;
  };
  showtime: {
    movie: { title: string };
    room: { name: string };
    start_time: string;
  };
  showtime_seat?: {
    seat: Seat;
  };
  booking: {
    user: {
      full_name: string;
      email: string;
    };
  };
}