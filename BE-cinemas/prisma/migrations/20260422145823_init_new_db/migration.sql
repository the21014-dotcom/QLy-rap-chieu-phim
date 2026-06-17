/*
  Warnings:

  - Added the required column `end_time` to the `Showtime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `showtime` ADD COLUMN `end_time` DATETIME(3) NOT NULL;
