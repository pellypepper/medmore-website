const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isAdmin } = require('../middleware/isAdmin');
const authController = require('../controller/auth');

// Login route
router.post('/login', passport.authenticate("local", { failureRedirect: "/" }), authController.login);

// Check auth
router.get('/check-auth', authController.checkAuth);

// Logout
router.post('/logout', authController.logout);

// Admin page
router.get('/admin', isAdmin, authController.adminPage);

module.exports = router;
