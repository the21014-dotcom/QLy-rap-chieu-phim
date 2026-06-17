"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("./mail.service");
const crypto = __importStar(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const querystring = __importStar(require("qs"));
let PaymentService = class PaymentService {
    constructor(prisma, configService, mailService) {
        this.prisma = prisma;
        this.configService = configService;
        this.mailService = mailService;
    }
    createVnPayUrl(bookingId, amount, ipAddr) {
        const date = new Date();
        const createDate = (0, moment_1.default)(date).format('YYYYMMDDHHmmss');
        const tmnCode = this.configService.get('VNP_TMN_CODE');
        const secretKey = this.configService.get('VNP_HASH_SECRET');
        let vnpUrl = this.configService.get('VNP_URL');
        const returnUrl = this.configService.get('VNP_RETURN_URL');
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = bookingId.toString();
        vnp_Params['vnp_OrderInfo'] = `Thanh toan ve xem phim cho booking ${bookingId}`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params = this.sortObject(vnp_Params);
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        return vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
    }
    async verifyVnPayReturn(query) {
        const vnp_SecureHash = query['vnp_SecureHash'];
        const clonedQuery = { ...query };
        delete clonedQuery['vnp_SecureHash'];
        delete clonedQuery['vnp_SecureHashType'];
        const sortedQuery = this.sortObject(clonedQuery);
        const secretKey = this.configService.get('VNP_HASH_SECRET');
        const signData = querystring.stringify(sortedQuery, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        if (vnp_SecureHash === signed) {
            if (query['vnp_ResponseCode'] === '00') {
                return { success: true, orderId: query['vnp_TxnRef'] };
            }
        }
        return { success: false };
    }
    async processVnPayIpn(query) {
        const vnp_SecureHash = query['vnp_SecureHash'];
        const clonedQuery = { ...query };
        delete clonedQuery['vnp_SecureHash'];
        const sortedQuery = this.sortObject(clonedQuery);
        const secretKey = this.configService.get('VNP_HASH_SECRET');
        const signData = querystring.stringify(sortedQuery, { encode: false });
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        if (vnp_SecureHash === signed) {
            const bookingId = Number(query['vnp_TxnRef']);
            const responseCode = query['vnp_ResponseCode'];
            if (responseCode === '00') {
                await this.completeBooking(bookingId);
                return { RspCode: '00', Message: 'Confirm Success' };
            }
            return { RspCode: '00', Message: 'Confirm Success (Failed Transaction)' };
        }
        return { RspCode: '97', Message: 'Invalid Checksum' };
    }
    async completeBooking(bookingId) {
        return await this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: bookingId },
                include: { tickets: true },
            });
            if (!booking)
                throw new common_1.NotFoundException('Không tìm thấy đơn hàng');
            if (booking.status === 'SUCCESS')
                return booking;
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: 'SUCCESS' },
            });
            const fullBooking = await tx.booking.findUnique({
                where: { id: bookingId },
                include: {
                    user: true,
                    showtime: {
                        include: {
                            movie: true,
                            room: { include: { cinema: true } }
                        }
                    },
                    tickets: { include: { seat: true } }
                }
            });
            if (fullBooking) {
                await this.mailService.sendTicketEmail(fullBooking);
            }
            const seatIds = booking.tickets.map((t) => t.seatId);
            await tx.showtimeSeat.updateMany({
                where: {
                    showtime_id: booking.showtime_id,
                    seat_id: { in: seatIds },
                },
                data: {
                    status: 'BOOKED',
                    held_at: null,
                },
            });
            return updatedBooking;
        });
    }
    sortObject(obj) {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
        }
        return sorted;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mail_service_1.MailService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map