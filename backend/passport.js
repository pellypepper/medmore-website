

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../db');

const configurePassport = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' }, 
      async (email, password, done) => {
        try {
          const result = await pool.query('SELECT * FROM "users" WHERE email = $1', [email]);
          const user = result.rows[0];
    
          if (!user) {
            return done(null, false, { message: 'No user with that username' });
          }
    
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            return done(null, false, { message: 'Incorrect password' });
          }
    
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
    

  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user with ID:', id);
      const result = await pool.query('SELECT * FROM "users" WHERE id = $1', [id]);
      console.log('User found:', result.rows[0]);
      done(null, result.rows[0]);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err, null);
    }
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isadmin) {
    return next();
  }
  res.status(403).json({ error: "Access denied" });
};

module.exports = { configurePassport, isAdmin };
