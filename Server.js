const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());


// Import the user routes
const userRoutes = require('./routes/userRoutes');

// Middleware to parse incoming JSON
app.use(express.json());

// Basic routes for health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/api', (req, res) => {
  res.send('API is working');
});

app.use(cors({
  origin: 'http://localhost:5173', // Allow only the frontend URL
}));

app.listen(5000, () => {
  console.log('Backend server running on http://localhost:5000');
});
// User-related routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');

  // Start server only after DB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
