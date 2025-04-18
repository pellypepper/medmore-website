const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: "postgresql://medmore:vVxkSTptn3ZqrsoOXutpOIgRBZUzrIir@dpg-ctcqkjd2ng1s739trkl0-a.oregon-postgres.render.com/foodstuff",
  ssl: { rejectUnauthorized: false }, // Use this only if required by your setup
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));

module.exports = pool;
