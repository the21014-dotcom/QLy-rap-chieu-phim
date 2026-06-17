import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const storageConfig = {
  storage: diskStorage({
    // Đường dẫn lưu file
    destination: './uploads/banners', 
    filename: (req, file, cb) => {
      // Tạo tên file duy nhất: thời gian hiện tại + số ngẫu nhiên
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `banner-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận các định dạng ảnh phổ biến
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return cb(new BadRequestException('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  }
};