const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Ensure the token is in the format "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token', err);
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded; // Set the decoded payload to req.user
    next();
  });
};

// Middleware to check user roles

module.exports = {authMiddleware}