import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    create(createPermissionDto: CreatePermissionDto): Promise<{
        id: number;
        name: string;
        api_path: string | null;
        method: string | null;
        module: string | null;
    }>;
    findAll(): Promise<({
        roles: {
            role_id: number;
            permission_id: number;
        }[];
    } & {
        id: number;
        name: string;
        api_path: string | null;
        method: string | null;
        module: string | null;
    })[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        api_path: string | null;
        method: string | null;
        module: string | null;
    }>;
    update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<{
        id: number;
        name: string;
        api_path: string | null;
        method: string | null;
        module: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        api_path: string | null;
        method: string | null;
        module: string | null;
    }>;
}
