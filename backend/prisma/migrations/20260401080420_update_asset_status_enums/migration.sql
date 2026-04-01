/*
  Warnings:

  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `assets` MODIFY `status` ENUM('Available', 'Assigned', 'Under Repair', 'Disposed', 'Returned', 'Maintenance Returned') NOT NULL DEFAULT 'Available';

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `description`;

-- RenameIndex
ALTER TABLE `categories` RENAME INDEX `code` TO `categories_code_key`;
