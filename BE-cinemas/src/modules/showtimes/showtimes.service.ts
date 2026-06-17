import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto/create-showtime.dto';
import {
  CinemaShowtimesResponse,
  MovieShowtimesResponse,
  FormatGroup,
  ShowtimeSlot,
} from './showtimes.types';
import moment from 'moment-timezone';

const VN_TZ = 'Asia/Ho_Chi_Minh';

// ─── Internal raw type cho helper groupByFormat ───────────────────────────────
interface RawShowtime {
  id: number;
  start_time: Date;
  end_time: Date;
  price_base: number;
  room: {
    name: string;
    room_type: string;
    cinema?: { id: number; name: string; address: string; city: string };
  };
  movie?: { id?: number; title?: string; rating?: string; duration?: number; language?: string };
  showtime_seats: { status: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFormatLabel(roomType: string, language = 'Phụ đề'): string {
  const langMap: Record<string, string> = {
    'Tiếng Việt': 'Lồng Tiếng Việt',
    'Phụ đề':    'Phụ Đề Anh',
    'Tiếng Anh': 'Phụ Đề Anh',
  };
  const typeMap: Record<string, string> = {
    STANDARD_2D: '2D',
    PREMIUM_3D:  '3D',
    IMAX:        'IMAX',
    GOLD_CLASS:  '2D',
  };
  return `${typeMap[roomType] ?? '2D'} ${langMap[language] ?? 'Phụ Đề Anh'}`;
}

function countAvailable(seats: { status: string }[]): number {
  return seats.filter((s) => s.status === 'AVAILABLE').length;
}

function groupByFormat(showtimes: RawShowtime[]): FormatGroup[] {
  const map = new Map<string, FormatGroup>();

  for (const st of showtimes) {
    const label = buildFormatLabel(st.room.room_type, st.movie?.language);
    // Group theo Label và Loại phòng (để tách riêng 2D thường và 2D Gold Class)
    const key = `${label}::${st.room.room_type}`;

    if (!map.has(key)) {
      map.set(key, {
        label,
        roomType: st.room.room_type,
        isGoldClass: st.room.room_type === 'GOLD_CLASS',
        showtimes: [],
      });
    }

    const slot: ShowtimeSlot = {
      id: st.id,
      roomName: st.room['name'] || (st.room as any).name, // Lấy tên phòng từ Seed (Phòng 01, Phòng 02...)
      start_time: moment(st.start_time).tz(VN_TZ).format(),
      end_time: moment(st.end_time).tz(VN_TZ).format(),
      availableSeats: countAvailable(st.showtime_seats),
      price_base: st.price_base,
    };

    map.get(key)!.showtimes.push(slot);
  }

  // Sắp xếp giờ chiếu
  for (const group of map.values()) {
    group.showtimes.sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
  }

  return Array.from(map.values());
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class ShowtimesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── 1. Sơ đồ ghế ──────────────────────────────────────────────────────────
  // src/modules/showtimes/showtimes.service.ts

async getRoomLayout(showtimeId: number) {
  const showtime = await this.prisma.showtime.findUnique({
    where: { id: showtimeId },
    include: {
      movie: { select: { title: true, rating: true, duration: true, language: true } },
      room: {
        include: {
          cinema: { select: { name: true, address: true } },
          seats: {
            orderBy: [{ row: 'asc' }, { number: 'asc' }],
            include: { 
              // Quan trọng: Lấy ShowtimeSeat để có giá đã tính toán sẵn
              showtime_seats: { where: { showtime_id: showtimeId } } 
            },
          },
        },
      },
    },
  });

  if (!showtime) throw new NotFoundException('Không tìm thấy suất chiếu');

  return {
    showtimeId: showtime.id,
    startTime: moment(showtime.start_time).tz(VN_TZ).format('HH:mm DD/MM/YYYY'),
    movie: showtime.movie,
    cinema: showtime.room.cinema,
    roomName: showtime.room.name,
    roomType: showtime.room.room_type,
    seats: showtime.room.seats.map((seatItem) => {
      const statusData = seatItem.showtime_seats[0]; 
      
      return {
        id: statusData?.id || seatItem.id, 
        row: seatItem.row,
        number: seatItem.number,
        type: seatItem.type,
        // THỐNG NHẤT: Lấy trực tiếp price_base từ bảng ShowtimeSeat
        // Nếu vì lý do gì đó không có (statusData undefined), mới dùng logic tính toán cũ làm dự phòng
        price: statusData ? Number(statusData.price_base) : (Number(showtime.price_base) + Number(seatItem.price_extra)),
        status: statusData?.status ?? 'AVAILABLE',
      };
    }),
  };
}

  // ── 2. Chi tiết suất chiếu (Dùng cho trang Booking/Bắp Nước) ──────────────
  async findOne(id: number) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            poster_url: true,
            duration: true,
            rating: true,
          }
        },
        room: {
          include: {
            cinema: {
              select: { name: true, city: true, address: true }
            }
          }
        },
        showtime_seats: {
          include: {
            seat: true
          }
        }
      }
    });

    if (!showtime) throw new NotFoundException('Không tìm thấy suất chiếu');
    return showtime;
  }

  // ── 2. Tất cả suất chiếu (Admin) ──────────────────────────────────────────
  async findAll() {
    return this.prisma.showtime.findMany({
      include: {
        movie: { select: { id: true, title: true, duration: true, rating: true } },
        room: {
          select: {
            id: true, name: true, room_type: true,
            cinema: { select: { id: true, name: true, city: true } },
          },
        },
        _count: { select: { showtime_seats: true } },
      },
      orderBy: { start_time: 'asc' },
    });
  }

  // ── 3. Theo phim → nhóm theo rạp ──────────────────────────────────────────
  async findByMovie(
  movieId: number,
  date?: string,
  city?: string,
): Promise<CinemaShowtimesResponse[]> {
  const target = date ? moment.tz(date, 'YYYY-MM-DD', VN_TZ) : moment.tz(VN_TZ);
  const startOfDay = target.clone().startOf('day').toDate();
  const endOfDay = target.clone().endOf('day').toDate();
  
  // Logic: Nếu là ngày hôm nay, chỉ lấy từ giờ hiện tại trở đi
  const now = moment().tz(VN_TZ).toDate();
  const startTimeFilter = target.isSame(moment(), 'day') ? now : startOfDay;

  const rows = await this.prisma.showtime.findMany({
    where: {
      movie_id: movieId,
      start_time: { 
        gte: startTimeFilter, 
        lte: endOfDay 
      },
      ...(city && {
        room: {
          cinema: {
            city: { contains: city }, // Lưu ý: Database Seed đang là "Hải Phòng"
          },
        },
      }),
    },
    include: {
      movie: { select: { language: true } },
      room: {
        select: {
          id: true,
          name: true,       // Lấy "Phòng 01", "Phòng 02"...
          room_type: true,
          cinema: { 
            select: { id: true, name: true, address: true, city: true } 
          },
        },
      },
      showtime_seats: { select: { status: true } },
    },
    orderBy: { start_time: 'asc' },
  });

  const cinemaMap = new Map<number, RawShowtime[]>();
  
  for (const st of rows) {
    const cid = st.room.cinema.id;
    if (!cinemaMap.has(cid)) cinemaMap.set(cid, []);
    
    // Mapping thủ công để khớp 100% với interface RawShowtime
    const rawSt: RawShowtime = {
      id: st.id,
      start_time: st.start_time,
      end_time: st.end_time,
      price_base: Number(st.price_base),
      room: {
        name: st.room.name,
        room_type: st.room.room_type,
        cinema: st.room.cinema
      },
      movie: {
        language: st.movie.language
      },
      showtime_seats: st.showtime_seats
    };

    cinemaMap.get(cid)!.push(rawSt);
  }

  return Array.from(cinemaMap.values()).map((list) => {
    const c = list[0].room.cinema!;
    return {
      id: c.id,
      name: c.name,
      address: c.address ?? '',
      city: c.city ?? '',
      formats: groupByFormat(list),
    };
  });
}
  // ── 4. Theo rạp → nhóm theo phim (Ảnh 1 CGV) ────────────────────────────
  async findByCinema(
    cinemaId: number,
    date?: string,
  ): Promise<MovieShowtimesResponse[]> {
    const target     = date ? moment.tz(date, 'YYYY-MM-DD', VN_TZ) : moment.tz(VN_TZ);
    const startOfDay = target.clone().startOf('day').toDate();
    const endOfDay   = target.clone().endOf('day').toDate();

    const rows = await this.prisma.showtime.findMany({
      where: {
        start_time: { gte: startOfDay, lte: endOfDay },
        room: { cinema_id: cinemaId },
      },
      include: {
        movie: {
          select: { id: true, title: true, rating: true, duration: true, language: true, poster_url: true },
        },
        room: { 
        select: { 
          id: true,
          name: true,          // ← THÊM
          room_type: true 
        } 
      },
        showtime_seats: { select: { status: true } },
      },
      orderBy: { start_time: 'asc' },
    });

    // Group theo movie
    const movieMap = new Map<number, RawShowtime[]>();
    for (const st of rows) {
      const mid = (st.movie as any).id as number;
      if (!movieMap.has(mid)) movieMap.set(mid, []);
      movieMap.get(mid)!.push(st as unknown as RawShowtime);
    }

    return Array.from(movieMap.values()).map((list) => {
      const m = (list[0] as RawShowtime).movie!;
      return {
        id:       m.id!,
        title:    m.title!,
        rating:   m.rating!,
        duration: m.duration!,
        poster_url: (m as any).poster_url,
        formats:  groupByFormat(list),
      };
    });
  }

  // ── 5. Tạo suất chiếu ────────────────────────────────────────────────────
  async create(dto: CreateShowtimeDto) {
    return this.prisma.$transaction(async (tx) => {
      const movie = await tx.movie.findUnique({ where: { id: dto.movie_id } });
      if (!movie) throw new NotFoundException('Không tìm thấy phim');

      const room = await tx.room.findUnique({
        where: { id: dto.room_id },
        include: { cinema: { select: { name: true } } },
      });
      if (!room)           throw new NotFoundException('Không tìm thấy phòng chiếu');
      if (!room.is_active) throw new BadRequestException('Phòng chiếu hiện không hoạt động');

      const startTime = moment.tz(dto.start_time, VN_TZ).toDate();
      const endTime   = moment(startTime).add(movie.duration + 15, 'minutes').toDate();

      const conflict = await tx.showtime.findFirst({
        where: {
          room_id: dto.room_id,
          OR: [
            { start_time: { lte: startTime }, end_time: { gt: startTime } },
            { start_time: { lt: endTime },    end_time: { gte: endTime } },
            { start_time: { gte: startTime }, end_time: { lte: endTime } },
          ],
        },
        include: { movie: { select: { title: true } } },
      });

      if (conflict) {
        throw new BadRequestException(
          `Phòng đã có suất "${conflict.movie.title}" lúc ${moment(conflict.start_time).tz(VN_TZ).format('HH:mm DD/MM')}`
        );
      }

      const showtime = await tx.showtime.create({
        data: {
          movie_id:   movie.id,
          room_id:    dto.room_id,
          price_base: dto.price_base,
          start_time: startTime,
          end_time:   endTime,
        },
      });

      const seats = await tx.seat.findMany({ where: { room_id: dto.room_id } });

      if (seats.length > 0) {
        await tx.showtimeSeat.createMany({
          data: seats.map((seat) => ({
            showtime_id: showtime.id,
            seat_id:     seat.id,
            status:      'AVAILABLE',
            price_base:  dto.price_base + (seat.price_extra || 0),
            seat_type:   seat.type,
          })),
        });
      }

      return {
        ...showtime,
        cinema:     room.cinema.name,
        roomName:   room.name,
        movieTitle: movie.title,
        totalSeats: seats.length,
      };
    });
  }
  
  // ── 6. Cập nhật suất chiếu ───────────────────────────────────────────────
  async update(id: number, dto: UpdateShowtimeDto) {
    const existing = await this.prisma.showtime.findUnique({
      where: { id },
      include: { movie: true },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy suất chiếu');

    const movieId   = dto.movie_id ?? existing.movie_id;
    const roomId    = dto.room_id  ?? existing.room_id;
    const startTime = dto.start_time
      ? moment.tz(dto.start_time, VN_TZ).toDate()
      : existing.start_time;

    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Không tìm thấy phim');

    const endTime = moment(startTime).add(movie.duration + 15, 'minutes').toDate();

    const conflict = await this.prisma.showtime.findFirst({
      where: {
        room_id: roomId,
        id: { not: id },
        OR: [
          { start_time: { lte: startTime }, end_time: { gt: startTime } },
          { start_time: { lt: endTime },    end_time: { gte: endTime } },
          { start_time: { gte: startTime }, end_time: { lte: endTime } },
        ],
      },
      include: { movie: { select: { title: true } } },
    });

    if (conflict) {
      throw new BadRequestException(
        `Phòng đã có suất "${conflict.movie.title}" ` +
        `lúc ${moment(conflict.start_time).tz(VN_TZ).format('HH:mm DD/MM')}` +
        ` — ${moment(conflict.end_time).tz(VN_TZ).format('HH:mm')}`,
      );
    }

    return this.prisma.showtime.update({
      where: { id },
      data: {
        movie_id:   movieId,
        room_id:    roomId,
        start_time: startTime,
        end_time:   endTime,
        ...(dto.price_base !== undefined && { price_base: dto.price_base }),
      },
    });
  }

  // ── 7. Xóa suất chiếu ────────────────────────────────────────────────────
  async remove(id: number) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
      include: { bookings: { select: { status: true } } },
    });
    if (!showtime) throw new NotFoundException('Không tìm thấy suất chiếu');

    const hasSuccess = showtime.bookings.some((b) => b.status === 'SUCCESS');
    if (hasSuccess) {
      throw new BadRequestException(
        'Không thể xóa suất chiếu đã có vé thanh toán thành công',
      );
    }

    return this.prisma.showtime.delete({ where: { id } });
  }
}