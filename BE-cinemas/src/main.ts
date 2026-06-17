import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Đảm bảo đường dẫn đúng với cấu trúc src của bạn
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 1. Sử dụng NestExpressApplication để có quyền truy cập vào các hàm của Express (như useStaticAssets)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. Thiết lập Prefix cho toàn bộ API (Ví dụ: http://localhost:8080/api/v1/banners)
  app.setGlobalPrefix('api/v1');

  // 3. Cấu hình Static Assets để xem được ảnh Banner đã upload
  // Giúp truy cập ảnh qua: http://localhost:8080/uploads/banners/tên-file.jpg
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Tiền tố trên URL
  });

  // 4. Cấu hình CORS
  app.enableCors({
    origin: ['http://localhost:5173' , 'http://localhost:3000'], // Cho phép Frontend React truy cập
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
   
  // 5. Cấu hình ValidationPipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có field lạ gửi lên
      transform: true, // Tự động chuyển kiểu dữ liệu (vd: string sang number nếu DTO yêu cầu)
    }),
  );

  const port = 8080;
  await app.listen(port);
  
  console.log('-------------------------------------------------------');
  console.log(`🚀 Server cinema đang chạy tại: http://localhost:${port}`);
  console.log(`📂 Thư mục ảnh: http://localhost:${port}/uploads`);
  console.log(`📑 API Prefix: http://localhost:${port}/api/v1`);
  console.log('-------------------------------------------------------');
}

bootstrap();