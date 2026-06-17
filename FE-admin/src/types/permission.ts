// Định nghĩa Permission khớp với model Permission trong Prisma
export interface IPermission {
  id: number;
  name: string;      // Ví dụ: CREATE_MOVIE
  api_path: string | null;
  method: string | null;
  module: string | null; // Ví dụ: MOVIES, USERS
}

// Định nghĩa quan hệ trung gian RolePermission
export interface IRolePermission {
  role_id: number;
  permission_id: number;
  permission: IPermission; // Dùng để include dữ liệu khi query
}

// Định nghĩa Role khớp với model Role trong Prisma
export interface IRole {
  id: number;
  name: string;        // SUPER_ADMIN, ADMIN, STAFF
  description: string | null;
  permissions?: IRolePermission[]; // Mảng các quyền đã gán cho Role này
  _count?: {
    users: number;     // Dùng để hiển thị số lượng nhân viên đang giữ Role này
  };
}