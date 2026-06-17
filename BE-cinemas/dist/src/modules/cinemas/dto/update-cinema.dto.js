"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCinemaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cinema_dto_1 = require("./create-cinema.dto");
class UpdateCinemaDto extends (0, mapped_types_1.PartialType)(create_cinema_dto_1.CreateCinemaDto) {
}
exports.UpdateCinemaDto = UpdateCinemaDto;
//# sourceMappingURL=update-cinema.dto.js.map