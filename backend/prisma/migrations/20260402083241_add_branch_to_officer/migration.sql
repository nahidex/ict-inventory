-- AlterTable
ALTER TABLE `officers` ADD COLUMN `branch_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `officers` ADD CONSTRAINT `officers_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
