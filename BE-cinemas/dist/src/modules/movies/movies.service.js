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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
let MoviesService = class MoviesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { genre, status } = query;
        const now = new Date();
        let whereCondition = { is_active: true };
        if (status === 'now_showing') {
            whereCondition.release_date = { lte: now };
        }
        else if (status === 'coming_soon') {
            whereCondition.release_date = { gt: now };
        }
        if (genre) {
            whereCondition.genres = {
                some: { genre: { name: genre } }
            };
        }
        return this.prisma.movie.findMany({
            where: whereCondition,
            include: {
                genres: { include: { genre: true } }
            },
            orderBy: { release_date: 'desc' }
        });
    }
    async findOne(id) {
        const now = (0, moment_timezone_1.default)().tz('Asia/Ho_Chi_Minh').toDate();
        const movie = await this.prisma.movie.findUnique({
            where: { id },
            include: {
                showtimes: {
                    where: {
                        start_time: {
                            gte: now,
                        },
                    },
                    include: {
                        room: {
                            include: {
                                cinema: true
                            }
                        },
                    },
                    orderBy: {
                        start_time: 'asc',
                    },
                },
                genres: {
                    include: {
                        genre: true
                    }
                }
            },
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Phim với ID ${id} không tồn tại`);
        }
        return movie;
    }
    async create(createMovieDto) {
        const { genre_ids, ...movieData } = createMovieDto;
        return await this.prisma.movie.create({
            data: {
                ...movieData,
                genres: {
                    create: genre_ids?.map((genreId) => ({
                        genre_id: genreId
                    })) || []
                }
            },
            include: {
                genres: {
                    include: {
                        genre: true
                    }
                }
            }
        });
    }
    async findNowShowing() {
        const now = new Date();
        return this.prisma.movie.findMany({
            where: {
                is_active: true,
                release_date: { lte: now },
            },
            include: { genres: { include: { genre: true } } }
        });
    }
    async findUpcoming() {
        const now = new Date();
        return this.prisma.movie.findMany({
            where: {
                is_active: true,
                release_date: { gt: now }
            },
            include: { genres: { include: { genre: true } } }
        });
    }
    async updateImages(id, files) {
        const poster_url = files.poster ? files.poster[0].path : undefined;
        const landscape_url = files.landscape ? files.landscape[0].path : undefined;
        return this.prisma.movie.update({
            where: { id },
            data: {
                poster_url,
                landscape_url
            }
        });
    }
    async update(id, updateMovieDto) {
        const { genre_ids, ...movieData } = updateMovieDto;
        const movie = await this.findOne(id);
        return this.prisma.movie.update({
            where: { id },
            data: {
                ...movieData,
                release_date: movieData.release_date ? new Date(movieData.release_date) : movie.release_date,
                end_date: movieData.end_date ? new Date(movieData.end_date) : movie.end_date,
                duration: movieData.duration ? Number(movieData.duration) : movie.duration,
                genres: genre_ids ? {
                    deleteMany: {},
                    create: genre_ids.map((genreId) => ({
                        genre_id: Number(genreId)
                    }))
                } : undefined
            },
            include: {
                genres: {
                    include: {
                        genre: true
                    }
                }
            }
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.movie.delete({
            where: { id },
        });
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map