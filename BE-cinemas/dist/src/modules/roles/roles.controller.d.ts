import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<({
        _count: {
            permissions: number;
        };
    } & {
        id: number;
        name: string;
        description: string | null;
    })[]>;
    findOne(id: number): Promise<{
        permissions: {
            role_id: number;
            permission_id: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
    }>;
    create(data: CreateRoleDto): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
    update(id: number, data: UpdateRoleDto): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
}
