import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: any): Promise<string>;
}
