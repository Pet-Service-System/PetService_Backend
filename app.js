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
const spaServiceRoutes = require('./routes/spaServiceRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const spaBookingRoutes = require('./routes/spaBookingRoutes');
const commentRoutes = require('./routes/commentRoutes');
const orderDetailsRoutes = require('./routes/orderDetailsRoutes');
const SpaBookingDetailsRoutes = require('./routes/spaBookingDetailsRoutes');
const cartRoutes = require('./routes/cartRoutes');


const dotenv = require('dotenv');

require('dotenv').config();

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
app.use('/api/services', spaServiceRoutes); 


// Work Schedule Routes
app.use('/api/schedules', scheduleRoutes);

// Order Routes
app.use('/api/orders', orderRoutes);

// Order Details Routes
app.use('/api/order-details', orderDetailsRoutes);


// Spa booking Routes
app.use('/api/Spa-bookings', spaBookingRoutes);

// Comment Routes
app.use('/api/comments', commentRoutes);

// Spa Booking Details Routes
app.use('/api/spa-booking-details', SpaBookingDetailsRoutes);

// cart Routes
app.use('/api/cart', cartRoutes);

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
