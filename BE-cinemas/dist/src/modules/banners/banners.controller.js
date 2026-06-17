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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersController = void 0;
const common_1 = require("@nestjs/common");
const banners_service_1 = require("./banners.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const fs = __importStar(require("fs"));
const banners_upload_1 = require("./banners.upload");
let BannersController = class BannersController {
    constructor(bannersService) {
        this.bannersService = bannersService;
    }
    async getActiveBanners() {
        return this.bannersService.findActive();
    }
    findAll() {
        return this.bannersService.findAll();
    }
    findOne(id) {
        return this.bannersService.findOne(id);
    }
    async create(file, createData) {
        const imageUrl = file ? `/uploads/banners/${file.filename}` : createData.image_url;
        return this.bannersService.create({
            title: createData.title,
            image_url: imageUrl,
            priority: Number(createData.priority || 0),
            is_active: String(createData.is_active) === 'true',
            type: createData.type,
            position: createData.position,
            target_link: createData.target_link,
            start_date: createData.start_date ? new Date(createData.start_date) : null,
            end_date: createData.end_date ? new Date(createData.end_date) : null,
            movie: createData.movie_id && createData.movie_id !== 'null'
                ? { connect: { id: Number(createData.movie_id) } }
                : undefined
        });
    }
    async update(id, file, updateData) {
        const currentBanner = await this.bannersService.findOne(id);
        const payload = {};
        if (updateData.title !== undefined)
            payload.title = updateData.title;
        if (updateData.priority !== undefined)
            payload.priority = Number(updateData.priority);
        if (updateData.is_active !== undefined)
            payload.is_active = String(updateData.is_active) === 'true';
        if (updateData.movie_id !== undefined) {
            if (updateData.movie_id === 'null' || !updateData.movie_id) {
                payload.movie = { disconnect: true };
            }
            else {
                payload.movie = { connect: { id: Number(updateData.movie_id) } };
            }
        }
        if (file) {
            this.deletePhysicalFile(currentBanner.image_url);
            payload.image_url = `/uploads/banners/${file.filename}`;
        }
        return this.bannersService.update(id, payload);
    }
    async remove(id) {
        const banner = await this.bannersService.findOne(id);
        this.deletePhysicalFile(banner.image_url);
        return this.bannersService.remove(id);
    }
    deletePhysicalFile(relativeIdPath) {
        if (relativeIdPath && relativeIdPath.startsWith('/uploads')) {
            const filePath = `./${relativeIdPath.startsWith('/') ? relativeIdPath.substring(1) : relativeIdPath}`;
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                }
                catch (err) {
                    console.error(`Không thể xóa file: ${filePath}`, err);
                }
            }
        }
    }
};
exports.BannersController = BannersController;
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "getActiveBanners", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', banners_upload_1.storageConfig)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', banners_upload_1.storageConfig)),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "remove", null);
exports.BannersController = BannersController = __decorate([
    (0, common_1.Controller)('banners'),
    __metadata("design:paramtypes", [banners_service_1.BannersService])
], BannersController);
//# sourceMappingURL=banners.controller.js.map