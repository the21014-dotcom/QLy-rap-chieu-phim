"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinemasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CinemasService = class CinemasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCinemaDto) {
        return this.prisma.cinema.create({
            data: createCinemaDto,
        });
    }
    async findAll() {
        return this.prisma.cinema.findMany({
            include: {
                _count: {
                    select: { rooms: true },
                },
                rooms: true,
            },
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const cinema = await this.prisma.cinema.findUnique({
            where: { id },
            include: { rooms: true },
        });
        if (!cinema) {
            throw new common_1.NotFoundException(`Cụm rạp với ID ${id} không tồn tại`);
        }
        return cinema;
    }
    async update(id, updateCinemaDto) {
        await this.findOne(id);
        return this.prisma.cinema.update({
            where: { id },
            data: updateCinemaDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.cinema.delete({
            where: { id },
        });
    }
};
exports.CinemasService = CinemasService;
exports.CinemasService = CinemasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CinemasService);
//# sourceMappingURL=cinemas.service.js.map