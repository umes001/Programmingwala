import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to reload environment from multiple possible locations (root .env and backend/.env)
export const reloadEnv = () => {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
  dotenv.config({ path: path.join(__dirname, '../.env') });
  dotenv.config();
};

reloadEnv();

// Hostinger MySQL Connection Configuration Resolver
export const getMySQLConfig = (override = {}) => {
  reloadEnv();

  let dbUrlConfig = {};
  const urlStr = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.JAWSDB_URL || process.env.CLEARDB_DATABASE_URL;
  if (urlStr) {
    try {
      const u = new URL(urlStr);
      dbUrlConfig = {
        host: u.hostname,
        port: u.port ? Number(u.port) : 3306,
        user: decodeURIComponent(u.username || ''),
        password: decodeURIComponent(u.password || ''),
        database: u.pathname ? u.pathname.replace(/^\//, '') : ''
      };
    } catch (_) {}
  }

  const resolvedHost = override.host || process.env.DB_HOST || process.env.MYSQL_HOST || process.env.HOSTINGER_DB_HOST || process.env.DATABASE_HOST || dbUrlConfig.host || 'localhost';
  const resolvedUser = override.user || process.env.DB_USER || process.env.MYSQL_USER || process.env.HOSTINGER_DB_USER || process.env.DATABASE_USER || process.env.DB_USERNAME || process.env.MYSQL_USERNAME || dbUrlConfig.user || 'root';
  const resolvedPass = override.password !== undefined
    ? override.password
    : (process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? process.env.HOSTINGER_DB_PASSWORD ?? process.env.DATABASE_PASSWORD ?? process.env.DB_PASS ?? process.env.MYSQL_PASS ?? dbUrlConfig.password ?? '');
  const resolvedDb = override.database || process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.HOSTINGER_DB_NAME || process.env.DATABASE_NAME || process.env.DB_DATABASE || dbUrlConfig.database || 'pranidha_school';
  const resolvedPort = Number(override.port || process.env.DB_PORT || process.env.MYSQL_PORT || process.env.HOSTINGER_DB_PORT || process.env.DATABASE_PORT || dbUrlConfig.port || 3306);

  return {
    host: resolvedHost,
    user: resolvedUser,
    password: resolvedPass,
    database: resolvedDb,
    port: resolvedPort,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 4000
  };
};

let activeDbConfig = getMySQLConfig();
let pool = null;
let isConnected = false;

export const getMySQLPool = () => {
  if (!pool) {
    activeDbConfig = getMySQLConfig();
    pool = mysql.createPool(activeDbConfig);
  }
  return pool;
};

// Reset pool with new config (e.g. after updating Hostinger credentials via admin)
export const resetMySQLPool = async (override = {}) => {
  try {
    if (pool && typeof pool.end === 'function') {
      await pool.end().catch(() => {});
    }
  } catch (_) {}
  activeDbConfig = getMySQLConfig(override);
  pool = mysql.createPool(activeDbConfig);
  isConnected = false;
  return await initMySQLTables();
};

// Test Hostinger MySQL credentials safely without resetting active pool
export const testMySQLConnection = async (config = {}) => {
  const testCfg = getMySQLConfig(config);
  let testConn = null;
  try {
    testConn = await mysql.createConnection({
      host: testCfg.host,
      user: testCfg.user,
      password: testCfg.password,
      database: testCfg.database,
      port: testCfg.port,
      connectTimeout: 8000
    });
    await testConn.query('SELECT 1');
    await testConn.end().catch(() => {});
    return {
      success: true,
      message: `Successfully connected to Hostinger MySQL (${testCfg.database} @ ${testCfg.host}:${testCfg.port})`
    };
  } catch (err) {
    if (testConn) {
      try { await testConn.end(); } catch (_) {}
    }
    return {
      success: false,
      message: err.message || 'Connection failed'
    };
  }
};

// Helper to write updated credentials to both root .env and backend/.env
export const updateEnvFiles = (newEnvVars) => {
  const backendEnvPath = path.join(__dirname, '../.env');
  const rootEnvPath = path.join(__dirname, '../../.env');

  const updateSingleFile = (filePath) => {
    try {
      let content = '';
      if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
      }
      for (const [key, value] of Object.entries(newEnvVars)) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(content)) {
          content = content.replace(regex, `${key}=${value}`);
        } else {
          content += `\n${key}=${value}`;
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
    } catch (err) {
      console.warn(`Could not update .env at ${filePath}:`, err.message);
    }
  };

  updateSingleFile(backendEnvPath);
  updateSingleFile(rootEnvPath);
  reloadEnv();
};

// Initialize MySQL Tables and Schema on Hostinger
export const initMySQLTables = async () => {
  try {
    const currentPool = getMySQLPool();
    const connection = await currentPool.getConnection();
    isConnected = true;
    console.log(`\x1b[32m✔ Connected to Hostinger MySQL Database: ${activeDbConfig.database} @ ${activeDbConfig.host}:${activeDbConfig.port}\x1b[0m`);

    // Create persistent storage table for JSON/key-value synchronization
    await connection.query(`
      CREATE TABLE IF NOT EXISTS system_store (
        collection_name VARCHAR(100) PRIMARY KEY,
        data_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create relational users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'parent', 'teacher', 'user', 'student') DEFAULT 'user',
        profile_image VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create admissions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admissions (
        id VARCHAR(100) PRIMARY KEY,
        application_number VARCHAR(100) NOT NULL UNIQUE,
        student_name VARCHAR(255) NOT NULL,
        student_dob VARCHAR(50),
        student_gender VARCHAR(50),
        student_class VARCHAR(100),
        parent_father_name VARCHAR(255),
        parent_mother_name VARCHAR(255),
        parent_email VARCHAR(255) NOT NULL,
        parent_phone VARCHAR(50),
        parent_address TEXT,
        status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
        remarks TEXT,
        documents_json LONGTEXT,
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create admission_payments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admission_payments (
        id VARCHAR(100) PRIMARY KEY,
        payment_ref VARCHAR(100) NOT NULL UNIQUE,
        amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        method ENUM('cash', 'razorpay', 'upi') NOT NULL,
        status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
        razorpay_order_id VARCHAR(100) DEFAULT '',
        razorpay_payment_id VARCHAR(100) DEFAULT '',
        application_number VARCHAR(100) DEFAULT '',
        student_db_id VARCHAR(100) DEFAULT '',
        student_details_json LONGTEXT,
        parent_details_json LONGTEXT,
        verified_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        student_id VARCHAR(100) NOT NULL UNIQUE,
        date_of_birth DATE,
        gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
        class VARCHAR(100) NOT NULL,
        parent_id VARCHAR(100),
        teacher_id VARCHAR(100),
        photo VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create fees table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fees (
        id VARCHAR(100) PRIMARY KEY,
        student_id VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        term VARCHAR(100) NOT NULL,
        due_date DATE,
        status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
        payment_date DATE DEFAULT NULL,
        transaction_id VARCHAR(100) DEFAULT '',
        payment_method VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create receipts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id VARCHAR(100) PRIMARY KEY,
        fee_id VARCHAR(100) NOT NULL,
        student_id VARCHAR(100) NOT NULL,
        receipt_number VARCHAR(100) NOT NULL UNIQUE,
        amount_paid DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        transaction_id VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create courses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) DEFAULT 0.00,
        duration VARCHAR(100) DEFAULT '',
        category VARCHAR(100) DEFAULT 'general',
        level VARCHAR(50) DEFAULT 'Beginner',
        is_active BOOLEAN DEFAULT TRUE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create assessments table in Hostinger MySQL
    await connection.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        job_title VARCHAR(255) DEFAULT 'General',
        duration INT DEFAULT 30,
        passing_score INT DEFAULT 50,
        max_attempts INT DEFAULT 1,
        shuffle_questions BOOLEAN DEFAULT TRUE,
        shuffle_options BOOLEAN DEFAULT TRUE,
        show_result BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        access_password VARCHAR(100) DEFAULT '',
        questions_json LONGTEXT,
        invited_candidates_json LONGTEXT,
        scheduled_at TIMESTAMP NULL,
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure access_password column exists for existing tables
    await connection.query(`
      ALTER TABLE assessments ADD COLUMN access_password VARCHAR(100) DEFAULT '';
    `).catch(() => {});

    // Create assessment_attempts table in Hostinger MySQL
    await connection.query(`
      CREATE TABLE IF NOT EXISTS assessment_attempts (
        id VARCHAR(100) PRIMARY KEY,
        assessment_id VARCHAR(100) NOT NULL,
        candidate_email VARCHAR(255) NOT NULL,
        candidate_name VARCHAR(255) DEFAULT 'Candidate',
        candidate_access_code VARCHAR(100),
        answers_json LONGTEXT,
        score INT DEFAULT 0,
        percentage INT DEFAULT 0,
        passed BOOLEAN DEFAULT FALSE,
        total_marks INT DEFAULT 0,
        time_taken INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'in-progress',
        violations_json LONGTEXT,
        certificate_number VARCHAR(100) DEFAULT '',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP NULL,
        INDEX idx_assessment (assessment_id),
        INDEX idx_candidate_email (candidate_email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      ALTER TABLE assessment_attempts ADD COLUMN certificate_number VARCHAR(100) DEFAULT '';
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts ADD COLUMN candidate_photo LONGTEXT;
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts MODIFY COLUMN candidate_photo LONGTEXT;
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts MODIFY COLUMN answers_json LONGTEXT;
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts MODIFY COLUMN violations_json LONGTEXT;
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts ADD COLUMN candidate_college VARCHAR(255) DEFAULT '';
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts ADD COLUMN candidate_dob VARCHAR(50) DEFAULT '';
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts ADD COLUMN candidate_roll_no VARCHAR(100) DEFAULT '';
    `).catch(() => {});

    await connection.query(`
      ALTER TABLE assessment_attempts ADD COLUMN candidate_phone VARCHAR(50) DEFAULT '';
    `).catch(() => {});

    // Create dedicated assessment_candidates table in Hostinger MySQL
    await connection.query(`
      CREATE TABLE IF NOT EXISTS assessment_candidates (
        id VARCHAR(100) PRIMARY KEY,
        assessment_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        dob VARCHAR(50),
        phone VARCHAR(50),
        college VARCHAR(255),
        roll_no VARCHAR(100),
        photo_url LONGTEXT,
        access_code VARCHAR(100),
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_assessment_student (assessment_id, email),
        INDEX idx_assessment (assessment_id),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create certificates table in Hostinger MySQL
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        certificate_number VARCHAR(100) UNIQUE NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        candidate_email VARCHAR(255),
        internship_name VARCHAR(255),
        grade VARCHAR(50),
        percentage INT DEFAULT 0,
        score INT DEFAULT 0,
        total_marks INT DEFAULT 0,
        issue_date VARCHAR(100),
        start_date VARCHAR(100),
        end_date VARCHAR(100),
        description TEXT,
        qr_code_data LONGTEXT,
        status VARCHAR(50) DEFAULT 'valid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_cert_num (certificate_number),
        INDEX idx_cert_email (candidate_email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create permanent students_registry table in Hostinger MySQL (never deleted when exams are deleted)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students_registry (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dob VARCHAR(50) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        college VARCHAR(255) DEFAULT '',
        roll_no VARCHAR(100) DEFAULT '',
        photo_url LONGTEXT,
        access_code VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_reg_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create arena_students table in Hostinger MySQL
    await connection.query(`
      CREATE TABLE IF NOT EXISTS arena_students (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        dob VARCHAR(50) DEFAULT '',
        college VARCHAR(255) DEFAULT '',
        photo LONGTEXT,
        score INT DEFAULT 0,
        solved_problems_json LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_arena_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create student_portfolios table in Hostinger MySQL
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_portfolios (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255),
        student_name VARCHAR(255),
        slug VARCHAR(100),
        avatar_image LONGTEXT,
        resume_pdf_url LONGTEXT,
        resume_pdf_name VARCHAR(255) DEFAULT '',
        data_json LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_port_slug (slug),
        INDEX idx_port_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure columns exist on already created student_portfolios table
    await connection.query(`ALTER TABLE student_portfolios ADD COLUMN avatar_image LONGTEXT;`).catch(() => {});
    await connection.query(`ALTER TABLE student_portfolios ADD COLUMN resume_pdf_url LONGTEXT;`).catch(() => {});
    await connection.query(`ALTER TABLE student_portfolios ADD COLUMN resume_pdf_name VARCHAR(255) DEFAULT '';`).catch(() => {});

    // Create kbc_questions table in Hostinger MySQL
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kbc_questions (
        id VARCHAR(100) PRIMARY KEY,
        level INT NOT NULL,
        topic VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        options_json LONGTEXT NOT NULL,
        correct INT NOT NULL,
        explanation TEXT,
        is_custom TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_kbc_level (level),
        INDEX idx_kbc_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create kbc_sessions table (Live session control state by Admin)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kbc_sessions (
        id VARCHAR(50) PRIMARY KEY,
        status ENUM('INACTIVE', 'WAITING', 'LIVE', 'COMPLETED') DEFAULT 'INACTIVE',
        show_in_navbar TINYINT(1) DEFAULT 0,
        current_level INT DEFAULT 1,
        current_question_id VARCHAR(100) DEFAULT NULL,
        is_locked TINYINT(1) DEFAULT 0,
        locked_option INT DEFAULT NULL,
        revealed_correct INT DEFAULT NULL,
        active_team_id VARCHAR(100) DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create kbc_teams table (Teams participating from their laptops)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kbc_teams (
        id VARCHAR(100) PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        leader_name VARCHAR(255) NOT NULL,
        access_code VARCHAR(50) NOT NULL UNIQUE,
        current_level INT DEFAULT 1,
        score_amount INT DEFAULT 0,
        safe_amount INT DEFAULT 0,
        status ENUM('REGISTERED', 'CONNECTED', 'HOTSEAT', 'ELIMINATED', 'WON') DEFAULT 'REGISTERED',
        submitted_option INT DEFAULT NULL,
        lifelines_used_json TEXT DEFAULT NULL,
        laptop_info VARCHAR(255) DEFAULT '',
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_team_code (access_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    connection.release();
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\x1b[33m⚠ MySQL connection notice:\x1b[0m ${error.message}`);
    console.warn(`\x1b[33m→ Operating in memory-safe synchronized store mode.\x1b[0m`);
    return false;
  }
};

// Check connection health
export const getMySQLStatus = () => {
  return {
    configured: Boolean(process.env.DB_NAME || process.env.MYSQL_DATABASE),
    host: activeDbConfig.host,
    port: activeDbConfig.port,
    database: activeDbConfig.database,
    user: activeDbConfig.user,
    connected: isConnected
  };
};

export default {
  getMySQLPool,
  resetMySQLPool,
  testMySQLConnection,
  updateEnvFiles,
  initMySQLTables,
  getMySQLStatus,
  reloadEnv
};
