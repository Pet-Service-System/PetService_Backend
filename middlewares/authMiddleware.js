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
const verifyRole = (req, res, next) => {
  const token = req.headers.authorization; // Assuming the token is included in the Authorization header
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify JWT token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check user's role
    if (decoded.role !== 'Sales Staff' && decoded.role !== 'Caretaker Staff') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Store user's role in req object for further use
    req.userRole = decoded.role;
    next();
  });
};

module.exports = {authMiddleware, verifyRole}