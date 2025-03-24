const express = require('express');
const bodyParser = require('body-parser');
const environment = require('dotenv');
const cors = require('cors');
const dbConfig = require('./config/config');

// Import routes
const userRoutes = require('./routes/userRoutes');
const watchRoutes = require('./routes/watchRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');

const app = express();

// Configure environment and database
environment.config();
dbConfig.run();

// Middleware
app.use(express.json());
app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());

// Base route
app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/watches', watchRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000')
});