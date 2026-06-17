import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Đã import trực tiếp hàm này
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './store/AdminAuthContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>
);