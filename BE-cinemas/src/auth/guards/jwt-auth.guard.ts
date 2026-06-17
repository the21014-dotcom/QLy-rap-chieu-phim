import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // CanActivate có thể trả về boolean, Promise hoặc Observable
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  // Định nghĩa kiểu dữ liệu cho các tham số để hết lỗi đỏ
  handleRequest(err: any, user: any, info: any) {
    // Nếu có lỗi hoặc user không tồn tại (Token sai, hết hạn, hoặc không gửi kèm)
    if (err || !user) {
      throw (
        err || 
        new UnauthorizedException('Bạn cần đăng nhập để thực hiện thao tác này')
      );
    }
    return user;
  }
}