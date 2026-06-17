import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as crypto from 'crypto';
import  moment from 'moment';
import * as querystring from 'qs';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  /**
   * 1. Tạo URL thanh toán VNPay
   */
  createVnPayUrl(bookingId: number, amount: number, ipAddr: string): string {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const tmnCode = this.configService.get('VNP_TMN_CODE');
    const secretKey = this.configService.get('VNP_HASH_SECRET');
    let vnpUrl = this.configService.get('VNP_URL');
    const returnUrl = this.configService.get('VNP_RETURN_URL');

    let vnp_Params: any = {};
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

  /**
   * 2. Xác nhận kết quả thanh toán từ VNPay (Return URL)
   */
  async verifyVnPayReturn(query: any) {
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

  /**
   * 3. Xử lý IPN từ VNPay (Cập nhật trạng thái ngầm)
   */
  async processVnPayIpn(query: any) {
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

  /**
   * 4. Logic Hoàn tất đặt vé (Transaction)
   */
  async completeBooking(bookingId: number) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Kiểm tra đơn hàng
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { tickets: true },
      });

      if (!booking) throw new NotFoundException('Không tìm thấy đơn hàng');
      if (booking.status === 'SUCCESS') return booking;

      // 2. Cập nhật trạng thái Booking
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'SUCCESS' },
      });

      // 3. Lấy dữ liệu đầy đủ để gửi Email
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

      // 4. Cập nhật trạng thái ghế từ HOLDING sang BOOKED
      const seatIds = booking.tickets.map((t: any) => t.seatId); // Kiểm tra lại field seat_id hay seatId

      await tx.showtimeSeat.updateMany({
        where: {
          showtime_id: booking.showtime_id, // Kiểm tra lại field name
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

  /**
   * Hàm sắp xếp tham số (Bắt buộc cho VNPay)
   */
  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    return sorted;
  }
}