const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://medmore:vVxkSTptn3ZqrsoOXutpOIgRBZUzrIir@dpg-ctcqkjd2ng1s739trkl0-a.oregon-postgres.render.com/foodstuff',
  ssl: {
    rejectUnauthorized: false, // Required for Render or other hosted DBs
  },
});

module.exports = pool;
