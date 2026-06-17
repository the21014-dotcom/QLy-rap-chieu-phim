import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách các role yêu cầu từ Decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Nếu API không yêu cầu quyền cụ thể, cho phép đi qua
    if (!requiredRoles) {
      return true;
    }

    // 3. Lấy thông tin user từ request (đã được JwtAuthGuard điền vào trước đó)
    const { user } = context.switchToHttp().getRequest();

    // 4. Kiểm tra sự tồn tại của user và cấu trúc role object như trong hình của bạn
    // Cấu trúc của bạn là: user.role.name
    if (!user || !user.role || !user.role.name) {
      throw new ForbiddenException('Bạn không có quyền truy cập tính năng này');
    }

    // 5. Kiểm tra xem tên role (ADMIN) có nằm trong danh sách được phép không
    const hasRole = requiredRoles.includes(user.role.name);

    if (!hasRole) {
      throw new ForbiddenException('Bạn không có quyền truy cập tính năng này');
    }

    return true;
  }
}