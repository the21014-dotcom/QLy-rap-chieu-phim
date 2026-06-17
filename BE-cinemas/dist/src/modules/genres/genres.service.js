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
exports.GenresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GenresService = class GenresService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createGenreDto) {
        try {
            return await this.prisma.genre.create({
                data: { name: createGenreDto.name, description: createGenreDto.description },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Tên thể loại này đã tồn tại');
            }
            throw error;
        }
    }
    async findAll() {
        return await this.prisma.genre.findMany({
            include: {
                _count: {
                    select: { movies: true },
                },
            },
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const genre = await this.prisma.genre.findUnique({
            where: { id },
            include: {
                movies: {
                    include: {
                        movie: true,
                    },
                },
            },
        });
        if (!genre) {
            throw new common_1.NotFoundException(`Không tìm thấy thể loại với ID ${id}`);
        }
        return genre;
    }
    async update(id, updateGenreDto) {
        await this.findOne(id);
        try {
            return await this.prisma.genre.update({
                where: { id },
                data: { name: updateGenreDto.name, description: updateGenreDto.description },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Tên thể loại mới đã tồn tại');
            }
            throw error;
        }
    }
    async remove(id) {
        await this.findOne(id);
        return await this.prisma.genre.delete({
            where: { id },
        });
    }
};
exports.GenresService = GenresService;
exports.GenresService = GenresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenresService);
//# sourceMappingURL=genres.service.js.map