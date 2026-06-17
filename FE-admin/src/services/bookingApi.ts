import api from './api';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const bookingApi = {
  // Lấy lịch sử giao dịch (History)
  getAllInvoices: (params?: any) => api.get('/bookings', { params }),
  
  // Lấy chi tiết 1 hóa đơn kèm theo ghế và đồ ăn (Relation: Tickets & ServiceOrders)
  getInvoiceDetail: (id: string) => api.get(`/bookings/${id}`),
  
  // Kiểm tra trạng thái thanh toán từ Webhook
  checkPaymentStatus: (bookingCode: string) => api.get(`/bookings/check-payment/${bookingCode}`),
  
  // Xuất file PDF hóa đơn
  exportInvoicePDF: (id: string) => api.get(`/bookings/${id}/export`, { responseType: 'blob' }),
};