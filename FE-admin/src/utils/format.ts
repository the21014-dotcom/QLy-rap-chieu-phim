import moment from 'moment';

/**
 * Format số thành định dạng tiền tệ Việt Nam (VNĐ)
 * Ví dụ: 100000 -> 100.000 đ
 */
export const formatCurrency = (amount: number | string): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return '0 đ';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

/**
 * Format ngày tháng năm theo chuẩn Việt Nam
 * Ví dụ: 2026-05-10 -> 10/05/2026
 */
export const formatDate = (date: string | Date): string => {
  return moment(date).format('DD/MM/YYYY');
};

/**
 * Format ngày giờ đầy đủ
 * Ví dụ: 10/05/2026 14:30
 */
export const formatDateTime = (date: string | Date): string => {
  return moment(date).format('DD/MM/YYYY HH:mm');
};

/**
 * Format tên ghế từ dữ liệu backend
 * Ví dụ: {row: 'A', number: 5} -> A05
 */
export const formatSeatName = (row: string, number: number | string): string => {
  const num = Number(number);
  // Thêm số 0 phía trước nếu số ghế < 10 (ví dụ: A05 thay vì A5)
  const formattedNumber = num < 10 ? `0${num}` : num;
  return `${row}${formattedNumber}`;
};

/**
 * Lấy nhãn và màu sắc cho trạng thái hóa đơn (Dùng cho Tag Ant Design)
 */
export const getStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'PAID':
      return { color: 'green', label: 'Thành công', icon: 'check' };
    case 'PENDING':
      return { color: 'gold', label: 'Chờ thanh toán', icon: 'clock' };
    case 'FAILED':
      return { color: 'red', label: 'Thất bại', icon: 'close' };
    case 'CANCELLED':
      return { color: 'default', label: 'Đã hủy', icon: 'stop' };
    default:
      return { color: 'blue', label: status, icon: 'info' };
  }
};