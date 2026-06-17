export type SeatType = 'NORMAL' | 'VIP' | 'SWEETBOX';
export interface ISeat {
    id: number;
    row: string;
    number: number;
    type: SeatType;
    isBooked: boolean;
    isSelected?: boolean;
}
