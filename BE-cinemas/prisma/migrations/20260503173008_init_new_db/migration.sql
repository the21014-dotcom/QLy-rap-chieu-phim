/*
  Warnings:

  - You are about to alter the column `total_amount` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to alter the column `price` on the `bookingfood` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to alter the column `price` on the `food` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to alter the column `discount_value` on the `promotion` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to alter the column `room_type` on the `room` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `price_extra` on the `seat` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `price_base` on the `showtime` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - You are about to alter the column `price` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.
  - A unique constraint covering the columns `[showtime_seat_id]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `BookingFood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_base` to the `ShowtimeSeat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showtime_seat_id` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `banner` ADD COLUMN `priority` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `total_amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `bookingfood` ADD COLUMN `total_price` INTEGER NOT NULL,
    MODIFY `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `cinema` ADD COLUMN `hotline` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `food` ADD COLUMN `category` ENUM('CORN', 'DRINK', 'COMBO', 'SNACK') NOT NULL DEFAULT 'COMBO',
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `promotion` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `max_discount` INTEGER NULL,
    ADD COLUMN `min_order_value` INTEGER NOT NULL DEFAULT 0,
    MODIFY `discount_value` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `room` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `room_type` ENUM('STANDARD_2D', 'PREMIUM_3D', 'IMAX', 'GOLD_CLASS') NOT NULL DEFAULT 'STANDARD_2D';

-- AlterTable
ALTER TABLE `seat` MODIFY `price_extra` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `showtime` MODIFY `price_base` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `showtimeseat` ADD COLUMN `price_base` INTEGER NOT NULL,
    ADD COLUMN `seat_type` ENUM('NORMAL', 'VIP', 'SWEETBOX', 'BROKEN') NOT NULL DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `showtime_seat_id` INTEGER NOT NULL,
    MODIFY `price` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `payment_method` ENUM('VNPAY', 'MOMO', 'ZALOPAY', 'CASH', 'COUNTER_CARD') NOT NULL,
    `payment_status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `transaction_id` VARCHAR(191) NULL,
    `amount` INTEGER NOT NULL,
    `pay_date` DATETIME(3) NULL,
    `bank_code` VARCHAR(191) NULL,
    `order_info` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_booking_id_key`(`booking_id`),
    UNIQUE INDEX `Payment_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Ticket_showtime_seat_id_key` ON `Ticket`(`showtime_seat_id`);

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_showtime_seat_id_fkey` FOREIGN KEY (`showtime_seat_id`) REFERENCES `ShowtimeSeat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
