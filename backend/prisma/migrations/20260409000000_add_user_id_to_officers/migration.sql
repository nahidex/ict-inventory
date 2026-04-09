-- AlterTable
ALTER TABLE `officers` ADD COLUMN `user_id` INTEGER NULL UNIQUE;

-- AddForeignKey
ALTER TABLE `officers` ADD CONSTRAINT `officers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
