const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const {authMiddleware} = require('./middlewares/authMiddleware'); 
const productRoutes = require('./routes/productRoutes');
const accountRoutes = require('./routes/accountRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const petRoutes = require('./routes/petRoutes'); 
const serviceRoutes = require('./routes/serviceRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const hotelBookingRoutes = require('./routes/hotelBookingRoutes');
const spaBookingRoutes = require('./routes/spaBookingRoutes');
const commentRoutes = require('./routes/commentRoutes');


const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
var corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));


// Routes
app.use('/api/auth', authRoutes);

// Product Routes
app.use('/api/products', productRoutes);

// Account Routes
app.use('/api/accounts', accountRoutes);

// Use pet routes
app.use('/api/pets', petRoutes); 

// Use service routes
app.use('/api/services', serviceRoutes); 

// Use hotel routes
app.use('/api/hotels', hotelRoutes);

// Work Schedule Routes
app.use('/api/schedules', scheduleRoutes);

// Order Routes
app.use('/api/orders', orderRoutes);

// Hotel booking Routes
app.use('/api/Hotel-bookings', hotelBookingRoutes);

// Spa booking Routes
app.use('/api/Spa-bookings', spaBookingRoutes);

// Comment Routes
app.use('/api/comments', commentRoutes);

// Apply authMiddleware to protected routes
app.use('/protected', authMiddleware);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.redirect('/main.jsx'); // Redirect to main.jsx
  }
});

// Error handling middleware
app.use(errorMiddleware); // Apply errorMiddleware


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});