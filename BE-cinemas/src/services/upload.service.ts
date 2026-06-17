import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable() // Sửa lỗi Cannot find name 'Injectable'
export class UploadService {
  constructor(private configService: ConfigService) {
    // Cấu hình Cloudinary (Lấy từ file .env)
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file:  any): Promise<string> {
    return new Promise((resolve, reject) => {
      // Sửa lỗi Namespace 'global.Express' has no exported member 'Multer'
      // Đảm bảo đã cài @types/multer
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'cinema_posters' },
        (error, result) => {
          if (error) return reject(new InternalServerErrorException('Upload thất bại'));
          resolve(result?.secure_url || '');
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}