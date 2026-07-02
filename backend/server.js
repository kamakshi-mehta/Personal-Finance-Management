import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import apiRouter from './src/routes/api.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend running on port 3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Main API Router
app.use('/api', apiRouter);

// Root fallback route
app.get('/', (req, res) => {
  res.send('Personal Finance Express Backend is Running');
});

// Start Express server and connect to MongoDB
const startServer = async () => {
  console.log('Connecting to database...');
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
};

startServer();
