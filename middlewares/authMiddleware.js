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

//check token
const checkToken = (req, res, next) => {
  // Lấy token từ header, query string hoặc cookie
  const token = req.header('x-auth-token') || req.query.token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Token not found. Authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    } else {
      return res.status(400).json({ message: 'Invalid token. Please log in again.' });
    }
  }
};
module.exports = {authMiddleware, checkToken};