/*
  Warnings:

  - Added the required column `branch_id` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assets` ADD COLUMN `branch_id` INTEGER NOT NULL,
    ADD COLUMN `current_officer_id` INTEGER NULL,
    ADD COLUMN `location_details` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_current_officer_id_fkey` FOREIGN KEY (`current_officer_id`) REFERENCES `officers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
