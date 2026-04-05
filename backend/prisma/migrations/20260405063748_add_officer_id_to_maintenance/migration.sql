-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `officer_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `maintenance_officer_id_fkey` ON `maintenance`(`officer_id`);

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_officer_id_fkey` FOREIGN KEY (`officer_id`) REFERENCES `officers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
