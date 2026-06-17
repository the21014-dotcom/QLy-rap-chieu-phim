/**
 * Định dạng tiền tệ: 100000 -> 100.000 ₫
 */
export const formatCurrency = (amount: number): string => {
  if (!amount && amount !== 0) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Định dạng ngày đầy đủ: 2026-04-17 -> 17/04/2026
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Lấy giờ từ ISO String: 2026-04-17T18:30:00 -> 18:30
 * Rất quan trọng cho trang hiển thị suất chiếu!
 */
export const formatTime = (dateString: string | Date): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Định dạng ngày kèm Thứ (giống app CGV): 17/04/2026 -> Thứ Sáu, 17/04
 */
export const formatDateWithDay = (dateString: string | Date): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: '2-digit', 
    month: '2-digit' 
  };
  return date.toLocaleDateString('vi-VN', options);
};