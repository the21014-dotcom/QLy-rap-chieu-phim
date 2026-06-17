import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  // 1. Lấy danh sách tất cả vai trò kèm số lượng quyền (Bạn đã có)
  async findAll() {
    return this.prisma.role.findMany({
      include: {
        _count: {
          select: { permissions: true } 
        }
      }
    });
  }

  // 2. Lấy chi tiết một vai trò kèm danh sách quyền hạn cụ thể
  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true // Để FE hiển thị các checkbox quyền đã chọn
      }
    });
    if (!role) {
      throw new NotFoundException(`Role với ID ${id} không tồn tại`);
    }
    return role;
  }

  // 3. Tạo vai trò mới (Bạn đã có)
  async create(data: CreateRoleDto) {
    return this.prisma.role.create({ 
      data 
    });
  }

  // 4. Cập nhật vai trò
  async update(id: number, data: UpdateRoleDto) {
    // Kiểm tra tồn tại trước khi update
    await this.findOne(id);
    return this.prisma.role.update({
      where: { id },
      data
    });
  }

  // 5. Xóa vai trò (Quan trọng: Cần kiểm tra xem có User nào đang dùng không)
  async remove(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } }
    });

    if (!role) throw new NotFoundException('Không tìm thấy vai trò');
    
    if (role._count.users > 0) {
      throw new Error('Không thể xóa vai trò đang có người dùng sử dụng');
    }

    return this.prisma.role.delete({
      where: { id }
    });
  }
}