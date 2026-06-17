import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendTicketEmail(bookingData: any): Promise<void>;
    sendNewPassword(email: string, newPass: string): Promise<void>;
    sendOTP(email: string, otp: string): Promise<void>;
}
