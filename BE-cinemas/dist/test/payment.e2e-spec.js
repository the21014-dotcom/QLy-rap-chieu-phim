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
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = __importStar(require("supertest"));
const app_module_1 = require("../src/app.module");
const crypto = __importStar(require("crypto"));
const qs = __importStar(require("qs"));
describe('Payment System (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('/payments/vnpay_ipn (GET) - Phải cập nhật trạng thái khi hash hợp lệ', async () => {
        const vnp_Params = {
            vnp_Amount: '7500000',
            vnp_BankCode: 'NCB',
            vnp_BankTranNo: 'VNP12345678',
            vnp_CardType: 'ATM',
            vnp_OrderInfo: 'Thanh toan don hang 5',
            vnp_PayDate: '20260423153000',
            vnp_ResponseCode: '00',
            vnp_TmnCode: process.env.VNP_TMN_CODE,
            vnp_TransactionNo: '123456',
            vnp_TransactionStatus: '00',
            vnp_TxnRef: '5',
        };
        const sortedParams = Object.keys(vnp_Params).sort().reduce((obj, key) => {
            obj[key] = vnp_Params[key];
            return obj;
        }, {});
        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        const response = await request(app.getHttpServer())
            .get('/payments/vnpay_ipn')
            .query({ ...vnp_Params, vnp_SecureHash: signed });
        expect(response.status).toBe(200);
        expect(response.body.RspCode).toBe('00');
    });
    afterAll(async () => {
        await app.close();
    });
});
//# sourceMappingURL=payment.e2e-spec.js.map