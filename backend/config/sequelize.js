import { Sequelize } from 'sequelize';
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

// Hostinger MySQL Configuration Resolver
export const getMySQLConfig = (override = {}) => {
  reloadEnv();
  return {
    host: override.host || process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
    user: override.user || process.env.DB_USER || process.env.MYSQL_USER || 'root',
    password: override.password !== undefined 
      ? override.password 
      : (process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASS || process.env.MYSQL_PASS || ''),
    database: override.database || process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'pranidha_school',
    port: Number(override.port || process.env.DB_PORT || process.env.MYSQL_PORT || 3306)
  };
};

let sequelizeInstance = null;
let activeDialect = 'mysql';
let isDbConnected = false;
let activeDbName = 'pranidha_school';
let activeDbHost = 'localhost';

// Create standard Hostinger MySQL Sequelize instance
export const createMySQLInstance = (overrideConfig = {}) => {
  const cfg = getMySQLConfig(overrideConfig);
  activeDbName = cfg.database;
  activeDbHost = cfg.host;

  return new Sequelize(cfg.database, cfg.user, cfg.password, {
    host: cfg.host,
    port: cfg.port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000
    },
    pool: {
      max: 15,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });
};

// Test Hostinger MySQL credentials without disrupting current active connection
export const testMySQLConnection = async (config = {}) => {
  const cfg = getMySQLConfig(config);
  const testSeq = new Sequelize(cfg.database, cfg.user, cfg.password, {
    host: cfg.host,
    port: cfg.port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 7000
    }
  });

  try {
    await testSeq.authenticate();
    await testSeq.close();
    return { success: true, message: `Successfully connected to Hostinger MySQL (${cfg.database} @ ${cfg.host}:${cfg.port})` };
  } catch (err) {
    try { await testSeq.close(); } catch (_) {}
    return { success: false, message: err.message };
  }
};

export const getSequelize = () => {
  if (sequelizeInstance) return sequelizeInstance;

  // Always use Hostinger MySQL
  sequelizeInstance = createMySQLInstance();
  activeDialect = 'mysql';
  return sequelizeInstance;
};

// Primary Initialization
export const initSequelize = async () => {
  const cfg = getMySQLConfig();
  
  // Connect to Hostinger MySQL
  try {
    const seq = createMySQLInstance();
    await seq.authenticate();

    sequelizeInstance = seq;
    isDbConnected = true;
    activeDialect = 'mysql';
    activeDbName = cfg.database;
    activeDbHost = cfg.host;
    console.log(`\x1b[32m✔ Sequelize connected to Hostinger MySQL: ${cfg.database} @ ${cfg.host}:${cfg.port}\x1b[0m`);

    return seq;
  } catch (err) {
    console.warn(`\x1b[33mℹ Hostinger MySQL connection notice: ${err.message}\x1b[0m`);
    if (!sequelizeInstance) {
      sequelizeInstance = createMySQLInstance();
      activeDialect = 'mysql';
      activeDbName = cfg.database;
      activeDbHost = cfg.host;
    }
    return sequelizeInstance;
  }
};

// Force dynamic reconnection to Hostinger MySQL (e.g. from admin panel or environment update)
export const switchSequelizeToMySQL = async (customConfig = {}) => {
  const cfg = getMySQLConfig(customConfig);
  const newMySQLInstance = createMySQLInstance(customConfig);

  await newMySQLInstance.authenticate();

  // Close existing connection if open
  try {
    if (sequelizeInstance && typeof sequelizeInstance.close === 'function') {
      await sequelizeInstance.close();
    }
  } catch (_) {}

  sequelizeInstance = newMySQLInstance;
  isDbConnected = true;
  activeDialect = 'mysql';
  activeDbName = cfg.database;
  activeDbHost = cfg.host;

  return sequelizeInstance;
};

export const getSequelizeStatus = () => {
  const cfg = getMySQLConfig();
  return {
    connected: isDbConnected,
    dialect: 'mysql',
    database: activeDbName || cfg.database,
    host: activeDbHost || cfg.host,
    port: cfg.port,
    user: cfg.user,
    isMySQLConfigured: Boolean(process.env.DB_NAME || process.env.MYSQL_DATABASE)
  };
};

export default getSequelize;
