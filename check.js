const bcrypt = require('bcrypt');
const pool = require('./db'); 

(async () => {
  try {
    const adminEmail = 'popsyasnat@gmail.com'; 
    const adminPassword = 'olayinkaA1';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Corrected SQL query
   const response = await pool.query('INSERT INTO "users" (email, password) VALUES ($1, $2)',
      [adminEmail, hashedPassword] 
    );
   if(response.ok){
     console.log('Admin user created successfully');
   }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end(); // Close database connection
  }
})();