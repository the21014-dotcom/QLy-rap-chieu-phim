"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = 8080;
    await app.listen(port);
    console.log('-------------------------------------------------------');
    console.log(`🚀 Server cinema đang chạy tại: http://localhost:${port}`);
    console.log(`📂 Thư mục ảnh: http://localhost:${port}/uploads`);
    console.log(`📑 API Prefix: http://localhost:${port}/api/v1`);
    console.log('-------------------------------------------------------');
}
bootstrap();
//# sourceMappingURL=main.js.map