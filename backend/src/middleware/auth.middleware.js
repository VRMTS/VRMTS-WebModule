const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
};

module.exports = authMiddleware;
