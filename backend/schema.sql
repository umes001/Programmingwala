-- ==============================================================================
-- Pranidha International Kindergarten & Learning Management System
-- Hostinger MySQL Database Schema & Initial Data
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Table structure for `system_store` (JSON Data Store for High Compatibility)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_store` (
  `collection_name` VARCHAR(100) NOT NULL,
  `data_json` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`collection_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'parent', 'teacher', 'user', 'student') DEFAULT 'user',
  `profile_image` VARCHAR(500) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `parents`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `parents` (
  `id` VARCHAR(100) NOT NULL,
  `user_id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `address` TEXT,
  `occupation` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `teachers`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` VARCHAR(100) NOT NULL,
  `user_id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT '',
  `specialization` VARCHAR(255) DEFAULT '',
  `qualifications` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `students`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `student_id` VARCHAR(100) NOT NULL UNIQUE,
  `date_of_birth` DATE DEFAULT NULL,
  `gender` ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  `class` VARCHAR(100) NOT NULL,
  `parent_id` VARCHAR(100) DEFAULT NULL,
  `teacher_id` VARCHAR(100) DEFAULT NULL,
  `photo` VARCHAR(500) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `teacher_id` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `admissions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admissions` (
  `id` VARCHAR(100) NOT NULL,
  `application_number` VARCHAR(100) NOT NULL UNIQUE,
  `student_name` VARCHAR(255) NOT NULL,
  `student_dob` VARCHAR(50) DEFAULT NULL,
  `student_gender` VARCHAR(50) DEFAULT 'Male',
  `student_class` VARCHAR(100) NOT NULL,
  `parent_father_name` VARCHAR(255) DEFAULT '',
  `parent_mother_name` VARCHAR(255) DEFAULT '',
  `parent_email` VARCHAR(255) NOT NULL,
  `parent_phone` VARCHAR(50) DEFAULT '',
  `parent_address` TEXT,
  `status` ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
  `remarks` TEXT,
  `documents_json` LONGTEXT,
  `submission_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `admission_payments`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admission_payments` (
  `id` VARCHAR(100) NOT NULL,
  `payment_ref` VARCHAR(100) NOT NULL UNIQUE,
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `method` ENUM('cash', 'razorpay', 'upi') NOT NULL,
  `status` ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
  `razorpay_order_id` VARCHAR(100) DEFAULT '',
  `razorpay_payment_id` VARCHAR(100) DEFAULT '',
  `application_number` VARCHAR(100) DEFAULT '',
  `student_db_id` VARCHAR(100) DEFAULT '',
  `student_details_json` LONGTEXT,
  `parent_details_json` LONGTEXT,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `fees`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fees` (
  `id` VARCHAR(100) NOT NULL,
  `student_id` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `term` VARCHAR(100) NOT NULL,
  `due_date` DATE DEFAULT NULL,
  `status` ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
  `payment_date` DATE DEFAULT NULL,
  `transaction_id` VARCHAR(100) DEFAULT '',
  `payment_method` VARCHAR(100) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `receipts`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `receipts` (
  `id` VARCHAR(100) NOT NULL,
  `fee_id` VARCHAR(100) NOT NULL,
  `student_id` VARCHAR(100) NOT NULL,
  `receipt_number` VARCHAR(100) NOT NULL UNIQUE,
  `amount_paid` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(100) NOT NULL,
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `transaction_id` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fee_id` (`fee_id`),
  KEY `student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `courses`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `duration` VARCHAR(100) DEFAULT '',
  `category` VARCHAR(100) DEFAULT 'general',
  `level` VARCHAR(50) DEFAULT 'Beginner',
  `is_active` BOOLEAN DEFAULT TRUE,
  `is_published` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
