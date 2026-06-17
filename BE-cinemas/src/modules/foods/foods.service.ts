import { 
  Injectable, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodCategory } from '@prisma/client'; // Import Enum từ Prisma client

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tạo món ăn mới
   */
  async create(createFoodDto: CreateFoodDto) {
    try {
      const { category, price, ...otherData } = createFoodDto;

      return await this.prisma.food.create({
        data: {
          ...otherData,
          price: Number(price), // Đảm bảo lưu vào DB là kiểu Int
          // Chuyển đổi string từ Frontend sang Enum Prisma
          category: (category as FoodCategory) || FoodCategory.COMBO,
        },
      });
    } catch (error) {
      console.error('Lỗi Create Food:', error);
      throw new InternalServerErrorException('Không thể tạo món ăn. Vui lòng kiểm tra lại dữ liệu đầu vào.');
    }
  }

  /**
   * Lấy danh sách tất cả món ăn (Mới nhất lên đầu)
   */
  async findAll() {
    try {
      return await this.prisma.food.findMany({
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi tải danh sách món ăn');
    }
  }

  /**
   * Lấy chi tiết 1 món ăn
   */
  async findOne(id: number) {
    const food = await this.prisma.food.findUnique({
      where: { id },
    });

    if (!food) {
      throw new NotFoundException(`Không tìm thấy món ăn với ID ${id}`);
    }
    return food;
  }

  /**
   * Cập nhật thông tin món ăn
   */
  async update(id: number, updateFoodDto: UpdateFoodDto) {
    // 1. Kiểm tra món ăn có tồn tại không
    await this.findOne(id);

    try {
      const { category, price, ...otherData } = updateFoodDto;

      return await this.prisma.food.update({
        where: { id },
        data: {
          ...otherData,
          // Chỉ cập nhật nếu có giá trị truyền xuống
          price: price !== undefined ? Number(price) : undefined,
          category: category ? (category as FoodCategory) : undefined,
        },
      });
    } catch (error) {
      console.error('Lỗi Update Food:', error);
      throw new InternalServerErrorException('Cập nhật thông tin món ăn thất bại');
    }
  }

  /**
   * Xóa món ăn khỏi hệ thống
   */
  async remove(id: number) {
    // 1. Kiểm tra món ăn có tồn tại không
    await this.findOne(id);

    try {
      return await this.prisma.food.delete({
        where: { id },
      });
    } catch (error) {
      // Trường hợp món ăn đã có trong BookingFood (Ràng buộc khóa ngoại)
      throw new InternalServerErrorException(
        'Không thể xóa món ăn này vì nó đã có trong lịch sử đặt hàng.'
      );
    }
  }
}