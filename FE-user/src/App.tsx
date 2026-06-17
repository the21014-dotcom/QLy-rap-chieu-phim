
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import Header from "./components/common/Header"; 
import Footer from "./components/common/Footer";

// Import các Trang (Pages)
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import MovieDetails from "./pages/MovieDetails";
import Booking from "./pages/Booking";
import Cinemas from "./pages/Cinemas";
import Promotions from "./pages/Promotions";
import Profile from "./pages/Profile";
import ProfileInfoPage from "./pages/Info";
import PaymentResult from "./pages/PaymentResult";
import Checkout from "./pages/Checkout";
import MyTickets from "./pages/MyTickets";
import Showtimes from "./pages/Showtimes";
import SeatSelection from "./pages/SeatSelection";
import BookingSuccess from "./pages/BookingSuccess";
import BookingFailed from "./pages/BookingFailed";
import MembershipRules from "./pages/MembershipRules"
import TicketDetails from "./pages/TicketDetail"
import FeedbackPage from "./pages/feedback"


function App() {
  return (
    // 1. AuthProvider phải bọc ngoài cùng để Header và các Page có thể dùng useAuth
    <AuthProvider>
      <Router>
        {/* Tự động cuộn lên đầu trang khi chuyển link */}
        <ScrollToTop /> 
        
        <div className="flex min-h-screen flex-col bg-dark font-sans text-white">
          {/* 2. Header nằm trong AuthProvider nên sẽ không còn lỗi "useAuth must be used within..." */}
          <Header />
          
          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/booking/:showtimeId" element={<Booking />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/booking-failed" element={<BookingFailed />} />
              <Route path="/cinemas" element={<Cinemas />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile-info" element={< ProfileInfoPage />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/Member" element={<MembershipRules />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/showtimes/:movieId" element={<Showtimes />} />
              <Route path="/seat-selection/:showtimeId" element={<SeatSelection />} />
              <Route path="/showtimes" element={<Showtimes />} />
              <Route path="/showtimes/movie/:movieId"  element={<Showtimes />} />
              <Route path="/showtimes/cinema/:cinemaId" element={<Showtimes />} />
             <Route path="/ticket/:id" element={<TicketDetails />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
          </main>

          <Footer />

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;