/*
  Warnings:

  - Added the required column `updated_at` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cols_per_row` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_type` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_rows` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_seats` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showtime_id` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movie` ADD COLUMN `actors` TEXT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `director` VARCHAR(191) NULL,
    ADD COLUMN `landscape_url` VARCHAR(191) NULL,
    ADD COLUMN `language` VARCHAR(191) NULL DEFAULT 'Tiếng Việt',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `room` ADD COLUMN `cols_per_row` INTEGER NOT NULL,
    ADD COLUMN `room_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `total_rows` INTEGER NOT NULL,
    ADD COLUMN `total_seats` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `seat` ADD COLUMN `price_extra` DECIMAL(65, 30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `showtime_id` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('BOOKING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'BOOKING';

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_showtime_id_fkey` FOREIGN KEY (`showtime_id`) REFERENCES `Showtime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
