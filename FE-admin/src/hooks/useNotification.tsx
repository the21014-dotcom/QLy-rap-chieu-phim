/* eslint-disable @typescript-eslint/no-explicit-any */
import { message, notification } from 'antd';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  ExclamationCircleFilled, 
  InfoCircleFilled 
} from '@ant-design/icons';

export const useNotify = () => {
  
  // 1. Thông báo nhanh (Toast Message) - Thường dùng cho các hành động CRUD
  const showMessage = (type: 'success' | 'error' | 'warning' | 'info', msg: string) => {
    message[type]({
      content: msg,
      className: 'font-medium',
      style: { marginTop: '10vh' },
    });
  };

  // 2. Thông báo chi tiết (Notification Box) - Khớp với Model Notification trong Prisma
  const alertSystem = (
    type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO',
    title: string,
    desc: string,
    linkUrl?: string
  ) => {
    const config = {
      SUCCESS: { icon: <CheckCircleFilled className="text-green-500" />, color: 'success' },
      ERROR: { icon: <CloseCircleFilled className="text-red-500" />, color: 'error' },
      WARNING: { icon: <ExclamationCircleFilled className="text-amber-500" />, color: 'warning' },
      INFO: { icon: <InfoCircleFilled className="text-blue-500" />, color: 'info' },
    };

    notification[config[type].color as 'success' | 'error' | 'warning' | 'info']({
      message: <span className="font-black uppercase italic text-slate-800">{title}</span>,
      description: (
        <div className="flex flex-col gap-2">
          <span className="text-slate-600">{desc}</span>
          {linkUrl && (
            <a href={linkUrl} className="text-blue-600 font-bold text-xs underline">
              XEM CHI TIẾT NGAY
            </a>
          )}
        </div>
      ),
      icon: config[type].icon,
      placement: 'topRight',
      duration: 5,
      className: 'rounded-xl border-l-4 border-l-slate-800 shadow-lg',
    });
  };

  // 3. Cảnh báo lỗi nghiêm trọng (Critical - Dành cho lỗi logic Backend/Prisma)
  const alertCritical = (errorObj: any) => {
    // Tự động bóc tách lỗi từ Axios/Backend NestJS
    const errorMessage = errorObj?.response?.data?.message || errorObj?.message || "Lỗi hệ thống không xác định";
    const errorCode = errorObj?.response?.data?.code || "INTERNAL_ERROR";

    notification.error({
      message: <span className="text-red-600 font-black">LỖI HỆ THỐNG NGHIÊM TRỌNG</span>,
      description: (
        <div className="bg-red-50 p-2 rounded mt-2 border border-red-100">
          <code className="text-[10px] text-red-800 font-mono">
            [Code: {errorCode}]: {errorMessage}
          </code>
        </div>
      ),
      duration: 0, // Không tự đóng để Admin copy lỗi
      placement: 'bottomRight',
    });
  };

  return { 
    success: (msg: string) => showMessage('success', msg), 
    error: (msg: string) => showMessage('error', msg),
    warning: (msg: string) => showMessage('warning', msg),
    info: (msg: string) => showMessage('info', msg),
    alertSystem,
    alertCritical 
  };
};