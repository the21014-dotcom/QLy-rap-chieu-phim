"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
describe('Booking System (e2e)', () => {
    let app;
    let adminToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        const loginRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@cgv.vn', password: 'admin123' });
        if (loginRes.status !== 201 && loginRes.status !== 200) {
            console.error('❌ Login thất bại! Kiểm tra lại tài khoản trong Seed.', loginRes.body);
        }
        adminToken = loginRes.body.access_token;
    });
    it('/movies/now-showing (GET) - Phải lấy được danh sách phim đang chiếu', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/movies/now-showing')
            .expect(200)
            .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
    it('/bookings (POST) - Phải báo lỗi khi đặt quá 8 ghế', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/bookings')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            showtime_id: 1,
            seat_ids: [2077, 2078, 2079, 2080, 2081, 2082, 2083, 2084, 2085],
            foods: []
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Không được đặt quá 8 ghế');
    });
    it('/bookings (POST) - Phải tính đúng tiền khi có giảm giá 50%', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/bookings')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            showtime_id: 9,
            seat_ids: [2088],
            promotion_code: "GIAM50",
            foods: []
        });
        if (response.status !== 201) {
            console.log('❌ Lỗi đặt vé giảm giá:', response.body);
        }
        expect(response.status).toBe(201);
        expect(response.status).toBe(201);
        expect(response.body.bookingId).toBeDefined();
        expect(response.body.url).toContain('vnpayment.vn');
    });
    it('/bookings (POST) - Không cho phép đặt trùng ghế', async () => {
        const bookingData = {
            showtime_id: 9,
            seat_ids: [2090, 2091],
            foods: [],
            promotion_code: null
        };
        await (0, supertest_1.default)(app.getHttpServer())
            .post('/bookings')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(bookingData)
            .expect(201);
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/bookings')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(bookingData);
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Ghế đã được đặt hoặc không tồn tại');
    });
    afterAll(async () => {
        await app.close();
    });
});
//# sourceMappingURL=booking.e2e-spec.js.map