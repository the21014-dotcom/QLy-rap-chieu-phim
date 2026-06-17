// src/types/index.ts
import { Movie, Showtime, Room } from '@prisma/client';

export type MovieWithDetails = Movie & {
  showtimes: (Showtime & {
    room: Room;
  })[];
};