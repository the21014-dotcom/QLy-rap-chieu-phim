import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './store/AdminAuthContext';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/Auth/AdminLogin';
import { ProtectedAdminRoute } from './routes/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import MovieList from './pages/Movies/MovieList';
import GenreList from './pages/Movies/GenreList';
import ShowtimesList from './pages/Showtimes/ShowtimeList'; 
import BannerManagement from './pages/Banners';
import RoomList from './pages/Showtimes/RoomList';

import InvoiceList from './pages/Invoices/InvoiceList';
import InvoiceDetail from './pages/Invoices/InvoiceDetail';
import SeatManagement from './pages/Showtimes/SeatManagement';
import NewsEvents from './pages/Content/NewsEvents';
import FeedbackList from './pages/Content/FeedbackList';
import SlideManagement from './pages/Content/SlideManagement';
import TicketList from './pages/Tickets/TicketList';
import RoleManagement from './pages/System/RoleManagement';
import Promotions from './pages/Promotions/index';
import Services from './pages/Services';
import CustomerList from './pages/Users/CustomerList';
import StaffList from './pages/Users/StaffList';
import CinemaManagement from './pages/Showtimes/CinemaManagement';

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Các route yêu cầu quyền ADMIN */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Lưu ý: Các route con bên trong Layout không cần lặp lại "/admin" ở đầu path */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="movies/list" element={<MovieList />} />
            <Route path="movies/genres" element={<GenreList />} />
            <Route path="showtimes/list" element={<ShowtimesList />} />
            <Route path="showtimes/rooms" element={<RoomList />} />
            <Route path="showtimes/cinemas" element={<CinemaManagement />} />
            <Route path="showtimes/seats" element={<SeatManagement />} />
            <Route path="/admin/showtimes/seats/:roomId" element={<SeatManagement />} />
            <Route path="system/roles" element={<RoleManagement />} />
            <Route path="system/permissions" element={<RoleManagement/>} />
            <Route path="users/customers" element={<CustomerList />} />
            <Route path="users/staffs" element={<StaffList />} />
            <Route path="banners" element={<BannerManagement />} />
            <Route path="content/slides" element={<SlideManagement />} />
            <Route path="content/events" element={<NewsEvents />} />
            <Route path="content/news" element={<Promotions />} />
            <Route path="content/feedbacks" element={<FeedbackList />} />  
            <Route path="invoices" element={<InvoiceList />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
            <Route path="tickets" element={<TicketList />} />
            <Route path="reports" element={<Dashboard />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="services" element={<Services />} />
          </Route> {/* Đóng thẻ AdminLayout */}
        </Route> {/* Đóng thẻ ProtectedAdminRoute */}
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;