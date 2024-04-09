const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variable for connection string
  ssl: {
    rejectUnauthorized: false // Ignore SSL certificate validation for Render deployments
  }
});

module.exports = pool;
