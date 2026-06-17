import { Injectable, NotFoundException ,BadRequestException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
  // Chuẩn hóa tên role: viết hoa toàn bộ và trim khoảng trắng
  const roleNameSearch = dto.roleName.toUpperCase().trim(); 

  

  const role = await this.prisma.role.findUnique({
    where: { name: roleNameSearch },
  });

    if (!role) {
    // In ra log để bạn kiểm tra xem nó đang tìm chữ gì mà không thấy
    console.error(`Role not found: [${roleNameSearch}]`); 
    throw new NotFoundException(`Vai trò ${roleNameSearch} không tồn tại trong DB`);
  }

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (existingUser) {
    throw new BadRequestException('Email này đã được đăng ký trong hệ thống');
  }

    // 3. Tạo User khớp với Schema (dùng role_id)
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        full_name: dto.full_name,
        phone: dto.phone,
        avatar: dto.avatar,
        is_verified: dto.is_verified || false,
        role_id: role.id, // Liên kết qua ID theo Schema
        
      },
      include: { role: true } // Trả về kèm thông tin Role để Frontend hiển thị
    });
  }

  async findAll(roleName?: string, search?: string) {
    let mappedRole = roleName;
  // Ánh xạ nếu title từ frontend truyền vào là tiếng Việt
  if (roleName === 'Khách hàng') mappedRole = 'CUSTOMER';
  if (roleName === 'Nhân viên') mappedRole = 'STAFF';
    return this.prisma.user.findMany({
      where: {
        // Lọc theo Role nếu có
        role: roleName ? { name: roleName } : undefined,
        // Tìm kiếm theo Email hoặc Tên
        OR: search ? [
          { email: { contains: search } },
          { full_name: { contains: search } }
        ] : undefined,
      },
      include: {
        role: true, // Lấy object Role
        _count: { select: { bookings: true } } // Đếm số đơn hàng khớp với Schema
      },
      orderBy: { created_at: 'desc' }
    });
  }
  async update(id: number, updateUserDto: any) {
  // Kiểm tra xem user có tồn tại không trước khi cập nhật
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException(`Không tìm thấy người dùng có ID #${id}`);

  // Nếu có cập nhật password, nhớ hash lại
  if (updateUserDto.password) {
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  // Xử lý roleName nếu người dùng thay đổi vai trò
  if (updateUserDto.roleName) {
    const role = await this.prisma.role.findUnique({
      where: { name: updateUserDto.roleName },
    });
    if (role) {
      updateUserDto.role_id = role.id;
    }
    delete updateUserDto.roleName; // Xóa field thừa trước khi đưa vào prisma
  }

  return this.prisma.user.update({
    where: { id },
    data: updateUserDto,
  });
}

async remove(id: number) {
  // Kiểm tra tồn tại
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException(`Không tìm thấy người dùng có ID #${id}`);

  // Thực hiện xóa
  return this.prisma.user.delete({
    where: { id },
  });
}
}