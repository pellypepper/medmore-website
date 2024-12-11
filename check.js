const bcrypt = require('bcrypt');
const pool = require('./db'); // Adjust this to your database connection

(async () => {
  try {
    const adminEmail = 'popsyasnat@gmail.com'; // Replace with your admin email
    const adminPassword = 'olayinkaA1'; // Replace with your desired default password
    const hashedPassword = await bcrypt.hash(adminPassword, 10); // 10 is the salt rounds

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