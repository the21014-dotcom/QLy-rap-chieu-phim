"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const movies_module_1 = require("./modules/movies/movies.module");
const cinemas_module_1 = require("./modules/cinemas/cinemas.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const payments_module_1 = require("./modules/payments/payments.module");
const mail_service_1 = require("./services/mail.service");
const upload_service_1 = require("./services/upload.service");
const auth_module_1 = require("./auth/auth.module");
const showtimes_module_1 = require("./modules/showtimes/showtimes.module");
const banners_module_1 = require("./modules/banners/banners.module");
const rooms_module_1 = require("./modules/rooms/rooms.module");
const tickets_module_1 = require("./modules/tickets/tickets.module");
const statistics_module_1 = require("./modules/statistics/statistics.module");
const seats_module_1 = require("./modules/seats/seats.module");
const promotions_module_1 = require("./modules/promotions/promotions.module");
const feedbacks_module_1 = require("./modules/feedbacks/feedbacks.module");
const genres_module_1 = require("./modules/genres/genres.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const users_module_1 = require("./modules/users/users.module");
const foods_module_1 = require("./modules/foods/foods.module");
const chat_module_1 = require("./modules/chat/chat.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            showtimes_module_1.ShowtimesModule,
            movies_module_1.MoviesModule,
            cinemas_module_1.CinemasModule,
            bookings_module_1.BookingsModule,
            payments_module_1.PaymentsModule,
            banners_module_1.BannersModule,
            rooms_module_1.RoomsModule,
            tickets_module_1.TicketsModule,
            feedbacks_module_1.FeedbacksModule,
            statistics_module_1.StatisticsModule,
            movies_module_1.MoviesModule,
            promotions_module_1.PromotionsModule,
            rooms_module_1.RoomsModule,
            seats_module_1.SeatsModule,
            genres_module_1.GenresModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            users_module_1.UsersModule,
            foods_module_1.FoodsModule,
            chat_module_1.ChatModule,
        ],
        providers: [
            mail_service_1.MailService,
            upload_service_1.UploadService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map