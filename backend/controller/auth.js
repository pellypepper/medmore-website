const path = require('path');

// Handle login (local strategy)
exports.login = (req, res) => {
  const user = req.user;
  if (user) {
    res.json({ user });
  }
};

// Check if user is authenticated
exports.checkAuth = (req, res) => {
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
};

// Handle logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.json({ message: "Logout successful" });
  });
};

// Serve admin page if user is admin
exports.adminPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'admin.html'));
};
