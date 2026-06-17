import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as crypto from 'crypto';
import * as qs from 'qs';

describe('Payment System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/payments/vnpay_ipn (GET) - Phải cập nhật trạng thái khi hash hợp lệ', async () => {
    // 1. Giả lập các tham số VNPay gửi về cho Booking ID số 5 (Ví dụ)
    const vnp_Params = {
      vnp_Amount: '7500000',
      vnp_BankCode: 'NCB',
      vnp_BankTranNo: 'VNP12345678',
      vnp_CardType: 'ATM',
      vnp_OrderInfo: 'Thanh toan don hang 5',
      vnp_PayDate: '20260423153000',
      vnp_ResponseCode: '00', // Thành công
      vnp_TmnCode: process.env.VNP_TMN_CODE,
      vnp_TransactionNo: '123456',
      vnp_TransactionStatus: '00',
      vnp_TxnRef: '5', // ID của Booking bạn muốn test
    };

    // 2. Tạo chữ ký giả lập (Phải giống hệt cách Backend tính toán)
    const sortedParams = Object.keys(vnp_Params).sort().reduce((obj, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});
    
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // 3. Gửi request giả lập IPN
    const response = await request(app.getHttpServer())
      .get('/payments/vnpay_ipn')
      .query({ ...vnp_Params, vnp_SecureHash: signed });

    // 4. Kỳ vọng kết quả
    expect(response.status).toBe(200);
    expect(response.body.RspCode).toBe('00');
  });

  afterAll(async () => {
    await app.close();
  });
});