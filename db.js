const { Pool } = require('pg');
require('dotenv').config(); // Ensure you're loading environment variables

// Create a new pool instance using environment variables
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false }, // Use this only if required by your setup
});

// Export the pool for use in other modules
module.exports = pool;

// Example of how to use the pool
async function testConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW()');
    console.log('Current time:', res.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Uncomment to test the connection
// testConnection();
