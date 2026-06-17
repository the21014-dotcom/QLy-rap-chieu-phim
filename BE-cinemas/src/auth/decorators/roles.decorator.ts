import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// File này CHỈ làm nhiệm vụ định nghĩa từ khóa @Roles()
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);