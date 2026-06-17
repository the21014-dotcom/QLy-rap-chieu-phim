import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './modules/movies/movies.module';
import { CinemasModule } from './modules/cinemas/cinemas.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MailService } from './services/mail.service';
import { UploadService } from './services/upload.service';
import { AuthModule } from './auth/auth.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { BannersModule } from './modules/banners/banners.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SeatsModule } from './modules/seats/seats.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { GenresModule } from './modules/genres/genres.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { UsersModule } from './modules/users/users.module';
import { FoodsModule } from './modules/foods/foods.module';
import { ChatModule } from './modules/chat/chat.module';
@Module({
  imports: [
    // 1. Cấu hình để đọc file .env
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    // 2. Kích hoạt Cron Job (Lập lịch)
    ScheduleModule.forRoot(),
    // 2. Kết nối Database
    PrismaModule,

    // 3. Các Module tính năng (Dựa trên các controller/service bạn đã viết)
    AuthModule,
    ShowtimesModule,
    MoviesModule,
    CinemasModule,
    BookingsModule,
    PaymentsModule,
    BannersModule,
    RoomsModule,
    TicketsModule,
    FeedbacksModule,
    StatisticsModule,
    MoviesModule,
    PromotionsModule,
    RoomsModule,
    SeatsModule,
    GenresModule,
    RolesModule,
    PermissionsModule,
    UsersModule,
    FoodsModule,
    ChatModule,
    
  ],
  
  providers: [
    
    // Đưa các Service dùng chung vào đây nếu chưa có module riêng
    MailService, 
    UploadService
  ],
})
export class AppModule {}