const { Pool } = require('pg');

const pool = new Pool({
  user: 'medmore',
  host: 'dpg-ctcqkjd2ng1s739trkl0-a.oregon-postgres.render.com',
  database: 'foodstuff',
  port: 5432,
  password: 'vVxkSTptn3ZqrsoOXutpOIgRBZUzrIir',
  ssl: { rejectUnauthorized: false },
});

async function runQueries() {
  const client = await pool.connect(); // Get a client from the pool
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        img VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        quantity INTEGER
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        payment_status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
        created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE
      );
    `);

    // Insert a user into the users table
    await client.query(`
      INSERT INTO users (email, created_at, password, isAdmin)
      VALUES ('popsyasnat@gmail.com', '2023-12-08 15:00:47', '$2b$10$H9PSWefLCTyPrrXX03HGAer4Pj7vkkXXCpyGY.6KcgJSL7eGsRWgi', TRUE);
    `);

    console.log('Tables created and user inserted successfully');
  } catch (err) {
    console.error('Error executing queries:', err);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Run the function
runQueries();

// Optionally, export the pool for use in other modules
module.exports = pool;
