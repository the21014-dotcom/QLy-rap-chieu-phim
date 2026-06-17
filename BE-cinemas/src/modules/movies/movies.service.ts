import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import moment from 'moment-timezone';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  // Lấy danh sách phim kèm lọc
  async findAll(query: any) {
    const { genre, status } = query;
    const now = new Date();

  let whereCondition: any = { is_active: true };

  // Thêm logic lọc theo status mà Frontend gửi lên
  if (status === 'now_showing') {
    whereCondition.release_date = { lte: now };
  } else if (status === 'coming_soon') {
    whereCondition.release_date = { gt: now };
  }

// 3. Logic lọc theo genre
  if (genre) {
    whereCondition.genres = {
      some: { genre: { name: genre } }
    };
  }

    // 4. TRUY VẤN VỚI whereCondition ĐÃ XÂY DỰNG
  return this.prisma.movie.findMany({
    where: whereCondition, // <--- Cực kỳ quan trọng: Phải dùng biến này
    include: {
      genres: { include: { genre: true } }
    },
    orderBy: { release_date: 'desc' } // Sắp xếp phim mới lên đầu
  });
}

  // Lấy chi tiết phim và suất chiếu
  // Lấy chi tiết phim và suất chiếu (Chỉ lấy các suất chiếu tương lai)
  async findOne(id: number) {
    // Lấy thời gian hiện tại theo múi giờ Việt Nam (hoặc dùng new Date() nếu server cùng múi giờ)
    const now = moment().tz('Asia/Ho_Chi_Minh').toDate();

    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          where: {
            // ĐIỀU KIỆN LỌC: start_time phải lớn hơn hoặc bằng thời gian hiện tại
            start_time: {
              gte: now,
            },
          },
          include: {
            room: { 
              include: { 
                cinema: true 
              } 
            }, // Xem phim này chiếu ở rạp nào
          },
          orderBy: {
            // SẮP XẾP: Giờ chiếu sớm nhất sẽ được xếp lên đầu danh sách
            start_time: 'asc',
          },
        },
        genres: { 
          include: { 
            genre: true 
          } 
        }
      },
    });

    if (!movie) {
      throw new NotFoundException(`Phim với ID ${id} không tồn tại`);
    }
    
    return movie;
  }

  // Tạo phim mới
  async create(createMovieDto: CreateMovieDto) {
    const { genre_ids, ...movieData } = createMovieDto;
    return await this.prisma.movie.create({
      data: {
      ...movieData,
      // Sử dụng trường 'genres' (tên quan hệ trong schema.prisma)
      genres: {
        create: genre_ids?.map((genreId: number) => ({
          genre_id: genreId
        })) || [] // Nếu không chọn thể loại nào thì để mảng rỗng
      }
    },
    // Trả về thông tin kèm theo thể loại để Frontend hiển thị được ngay
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    }
  });
}
  // 1. Lấy phim đang chiếu

async findNowShowing() {
  const now = new Date();
  return this.prisma.movie.findMany({
    where: {
      is_active: true,
      release_date: { lte: now }, // Ngày công chiếu nhỏ hơn hoặc bằng hiện tại
      //end_date: { gte: now },    
      // Nâng cao: Chỉ lấy phim thực sự đã được xếp lịch chiếu
      //showtimes: {
        //some: {
          //start_time: { gte: now } 
        
    },
    include: { genres: { include: { genre: true } } }
  });
}


async findUpcoming() {
  const now = new Date();
  return this.prisma.movie.findMany({
    where: {
      is_active: true,
      release_date: { gt: now } // Ngày công chiếu lớn hơn hiện tại
    },
    include: { genres: { include: { genre: true } } }
  });
}

  // 2. Cập nhật ảnh (Giả sử bạn lưu path vào DB)
  async updateImages(id: number, files: any) {
    const poster_url = files.poster ? files.poster[0].path : undefined;
    const landscape_url = files.landscape ? files.landscape[0].path : undefined;

    return this.prisma.movie.update({
      where: { id },
      data: {
        poster_url,
        landscape_url
      }
    });
  }
  
  async update(id: number, updateMovieDto: any) {
  // 1. Tách genre_ids ra, phần còn lại nằm trong movieData
  const { genre_ids, ...movieData } = updateMovieDto;
  
  const movie = await this.findOne(id);

  return this.prisma.movie.update({
    where: { id },
    data: {
      // 2. CHỈ dùng movieData ở đây (không dùng updateMovieDto)
      ...movieData, 
      
      // 3. Ép kiểu dữ liệu thủ công để đảm bảo khớp Prisma
      release_date: movieData.release_date ? new Date(movieData.release_date) : movie.release_date,
      end_date: movieData.end_date ? new Date(movieData.end_date) : movie.end_date,
      duration: movieData.duration ? Number(movieData.duration) : movie.duration,
      
      // 4. Xử lý logic thể loại
      genres: genre_ids ? {
        deleteMany: {}, 
        create: genre_ids.map((genreId: number) => ({
          genre_id: Number(genreId)
        }))
      } : undefined // Nếu không gửi genre_ids lên thì không cập nhật phần này
    },
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    }
  });
}

  // Xóa phim
  async remove(id: number) {
    await this.findOne(id); // Kiểm tra tồn tại
    return this.prisma.movie.delete({
      where: { id },
    });
  }
  
}