const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isadmin) {
      return next();
    }
    res.status(403).json({ error: "Access denied" });
  };

  module.exports = { isAdmin };