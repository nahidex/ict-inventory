-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categories_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `officers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branch_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `photo_url` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `officers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `branch_id` INTEGER NOT NULL,
    `current_officer_id` INTEGER NULL,
    `asset_tag` VARCHAR(50) NOT NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(50) NULL,
    `serial_number` VARCHAR(100) NULL,
    `purchase_date` DATE NULL,
    `purchase_source` ENUM('Planning', 'Development', 'Budget-2') NOT NULL DEFAULT 'Planning',
    `location_details` VARCHAR(255) NULL,
    `initial_image_url` TEXT NULL,
    `status` ENUM('Available', 'Assigned', 'Under Repair', 'Disposed', 'Returned', 'Maintenance Returned') NOT NULL DEFAULT 'Available',

    UNIQUE INDEX `assets_asset_tag_key`(`asset_tag`),
    UNIQUE INDEX `assets_serial_number_key`(`serial_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NULL,
    `officer_id` INTEGER NULL,
    `issue_date` DATE NOT NULL,
    `actual_return_date` DATE NULL,
    `return_condition` TEXT NULL,
    `return_image_url` TEXT NULL,
    `comments` TEXT NULL,
    `issued_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NULL,
    `officer_id` INTEGER NULL,
    `issue_description` TEXT NULL,
    `repair_cost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `vendor_details` TEXT NULL,
    `start_date` DATE NULL,
    `completion_date` DATE NULL,
    `status` ENUM('Pending', 'In Progress', 'Completed', 'Unrepairable') NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `noc_clearance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `officer_id` INTEGER NULL,
    `application_date` DATE NULL,
    `approval_date` DATE NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    `remarks` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NULL,
    `action_type` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `performed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `room_number` VARCHAR(20) NULL,
    `phone_ext` VARCHAR(20) NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `officers` ADD CONSTRAINT `officers_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assets` ADD CONSTRAINT `assets_current_officer_id_fkey` FOREIGN KEY (`current_officer_id`) REFERENCES `officers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_officer_id_fkey` FOREIGN KEY (`officer_id`) REFERENCES `officers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenances` ADD CONSTRAINT `maintenances_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenances` ADD CONSTRAINT `maintenances_officer_id_fkey` FOREIGN KEY (`officer_id`) REFERENCES `officers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `noc_clearance` ADD CONSTRAINT `noc_clearance_officer_id_fkey` FOREIGN KEY (`officer_id`) REFERENCES `officers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

