// 1. Export mặc định chính là Component trang Quản lý dịch vụ
export { default } from './ServiceList'; 

// 2. Export các component con để dùng ở nơi khác nếu cần (ví dụ Modal, Form)
export { default as ServiceList } from './ServiceList';
export { default as ServiceModal } from './ServiceModal';


export type { Food } from '../../types/food'; 