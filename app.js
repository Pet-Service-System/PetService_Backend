const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware'); 
const productRoutes = require('./routes/productRoutes');

const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Product Routes
app.use('/api/products', productRoutes);

// Apply authMiddleware to protected routes
app.use('/protected', authMiddleware);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'main.jsx')); // Corrected to serve the file
  } else {
    res.status(404).json({ message: 'API route not found' }); // Return 404 for unmatched API routes
  }
});

// Error handling middleware
app.use(errorMiddleware); // Apply errorMiddleware


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
