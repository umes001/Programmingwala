import mockStore from './mockStore.js';
import { initMySQLTables } from './mysql.js';

export const connectDB = async () => {
  console.log('\x1b[36m==================================================================\x1b[0m');
  console.log('\x1b[36m  Initializing Hostinger MySQL & Application Database Service...  \x1b[0m');
  console.log('\x1b[36m==================================================================\x1b[0m');

  // Ensure mock/unified store is active so no MongoDB Atlas connection is needed
  mockStore.isMock = true;

  try {
    const isMySQLReady = await initMySQLTables();
    if (isMySQLReady) {
      console.log('\x1b[32m✔ Hostinger MySQL connection and schema initialized successfully.\x1b[0m');
    } else {
      console.log('\x1b[33mℹ Running with local resilient storage. Provide DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env to connect to Hostinger MySQL.\x1b[0m');
    }
  } catch (err) {
    console.warn('MySQL Initialization notice:', err.message);
  }
};

export default { connectDB };
