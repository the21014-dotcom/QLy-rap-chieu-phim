// types/cinema.ts
export type SeatType = 'NORMAL' | 'VIP' | 'SWEETBOX';

export interface ISeat {
  id: number;
  row: string;
  number: number;
  type: SeatType;
  isBooked: boolean; // Đã có người mua
  isSelected?: boolean; // Người dùng hiện tại đang chọn
}