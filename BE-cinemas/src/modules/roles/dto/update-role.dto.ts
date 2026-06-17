import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

// PartialType giúp biến tất cả các trường trong CreateRoleDto thành optional (?)
// nhưng vẫn giữ nguyên các quy tắc validate (IsString, MaxLength...)
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}