"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
exports.storageConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads/banners',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = (0, path_1.extname)(file.originalname);
            cb(null, `banner-${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            return cb(new common_1.BadRequestException('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
};
//# sourceMappingURL=banners.upload.js.map