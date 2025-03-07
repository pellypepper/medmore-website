

const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isAdmin } = require('../passport');
const path = require('path');


// Login route
router.post('/login', passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
  const user = req.user;
    if (user) {
        res.json({
            user: req.user
          });
    }
 
});

// Check authentication status
router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      }
    });
  }
  res.json({ authenticated: false });
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.json({ message: "Logout successful" });
  });
});

// Admin page check
router.get('/admin', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'admin.html'));
});

module.exports = router;