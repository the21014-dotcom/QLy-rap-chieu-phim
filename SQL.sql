CREATE DATABASE TAcinemas
use TAcinemas

ALTER TABLE banner DROP FOREIGN KEY Banner_movie_id_fkey;
-- 1. Chỉnh cho user root (Thay 'YourPassword' bằng mật khẩu trong file .env)
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Anh1234@';

SELECT * FROM tacinemas.user ORDER BY id DESC LIMIT 5;

-- Tạm thời tắt check khóa ngoại để sửa ID
SET FOREIGN_KEY_CHECKS = 0;

-- Cập nhật ID của testuser (đang là 10) thành 16 để khớp với Token
UPDATE user SET id = 16 WHERE id = 10;

-- Bật lại check khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE banner 
ADD COLUMN updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);;



SET FOREIGN_KEY_CHECKS = 0;

-- 2. Sửa ID của một user bất kỳ (ví dụ ID 10) thành 16
UPDATE user SET id = 16 WHERE id = 10;

-- 3. Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Kiểm tra lại dữ liệu
SELECT * FROM user WHERE id = 16;




ALTER TABLE banner ADD COLUMN created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3);
ALTER TABLE banner ADD COLUMN updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
-- 2. Đảm bảo quyền được áp dụng ngay
FLUSH PRIVILEGES;

-- 1. Quản lý Rạp
CREATE TABLE Cinemas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100)
);

CREATE TABLE Rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cinema_id INT,
    name VARCHAR(50),
    FOREIGN KEY (cinema_id) REFERENCES Cinemas(id) ON DELETE CASCADE
);

CREATE TABLE Seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    row_char VARCHAR(2), -- A, B, C
    number INT, -- 1, 2, 3
    type ENUM('NORMAL', 'VIP', 'SWEETBOX') DEFAULT 'NORMAL',
    FOREIGN KEY (room_id) REFERENCES Rooms(id) ON DELETE CASCADE
);

-- 2. Quản lý Phim & Suất chiếu
CREATE TABLE Movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    duration INT,
    rating ENUM('P', 'C13', 'C16', 'C18'),
    poster_url VARCHAR(255),
    release_date DATE,
    description TEXT
);

CREATE TABLE Showtimes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT,
    room_id INT,
    start_time DATETIME,
    price_base DECIMAL(10,2),
    FOREIGN KEY (movie_id) REFERENCES Movies(id),
    FOREIGN KEY (room_id) REFERENCES Rooms(id)
);

-- 3. Quản lý Người dùng & Đặt vé
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role ENUM('ADMIN', 'STAFF', 'CUSTOMER') DEFAULT 'CUSTOMER',
    full_name VARCHAR(255),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(6),
    otp_exp DATETIME
);

CREATE TABLE Bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    showtime_id INT,
    total_amount DECIMAL(10,2),
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (showtime_id) REFERENCES Showtimes(id)
);

CREATE TABLE Tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    seat_id INT,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES Seats(id)
);

-- 1. Quản lý Đồ ăn & Combo
CREATE TABLE Food (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE
);

-- 2. Quản lý Khuyến mãi
CREATE TABLE Promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('PERCENT', 'FIXED_AMOUNT') DEFAULT 'PERCENT',
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    usage_limit INT,
    used_count INT DEFAULT 0
);

-- 3. Cập nhật bảng Bookings để liên kết Khuyến mãi
-- (Nếu bảng Bookings đã tồn tại, hãy chạy lệnh ALTER này)
ALTER TABLE Bookings ADD COLUMN promotion_id INT;
ALTER TABLE Bookings ADD FOREIGN KEY (promotion_id) REFERENCES Promotions(id);

-- 4. Bảng trung gian Chi tiết Đồ ăn trong đơn hàng (BookingFood)
CREATE TABLE BookingFood (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Giá lúc mua để lưu vết
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES Food(id)
);

ALTER TABLE User
ADD COLUMN full_name VARCHAR(255),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE, -- Kiểm tra đã xác thực email chưa
ADD COLUMN otp_code VARCHAR(6),                -- Lưu mã xác thực tạm thời
ADD COLUMN otp_exp DATETIME;                   -- Thời hạn của mã OTP (thường là 5-10 phút)


CREATE TABLE Genres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE MovieGenres (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(id) ON DELETE CASCADE
);

-- 2. Quản lý trạng thái ghế thực tế cho mỗi suất chiếu
CREATE TABLE ShowtimeSeats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    showtime_id INT,
    seat_id INT,
    status ENUM('AVAILABLE', 'BOOKED', 'HOLDING') DEFAULT 'AVAILABLE',
    held_at TIMESTAMP NULL, -- Dùng để giải phóng ghế nếu hết thời gian thanh toán
    FOREIGN KEY (showtime_id) REFERENCES Showtimes(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES Seats(id) ON DELETE CASCADE
);

-- 3. Quản lý Banner cho Frontend
CREATE TABLE Banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    movie_id INT, -- Nếu click banner ra trang phim
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (movie_id) REFERENCES Movies(id)
);

-- 4. Đánh giá (Feedback)
CREATE TABLE Feedbacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    movie_id INT,
    content TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (movie_id) REFERENCES Movies(id)
);