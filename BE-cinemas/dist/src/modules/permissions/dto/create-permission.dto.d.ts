export declare class CreatePermissionDto {
    name: string;
    api_path?: string;
    method?: string;
    module?: string;
}
declare const UpdatePermissionDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePermissionDto>>;
export declare class UpdatePermissionDto extends UpdatePermissionDto_base {
}
export {};
