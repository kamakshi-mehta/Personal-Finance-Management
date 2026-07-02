import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  let dbStatusString = 'Disconnected';
  if (dbStatus === 1) dbStatusString = 'Connected';
  else if (dbStatus === 2) dbStatusString = 'Connecting';
  else if (dbStatus === 3) dbStatusString = 'Disconnecting';

  res.json({
    status: 'ok',
    service: 'Backend Express Server',
    mongodb: dbStatusString,
    timestamp: new Date()
  });
});

// Check status of AI Microservice
router.get('/ai-status', async (req, res) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  try {
    const start = Date.now();
    const response = await fetch(`${aiServiceUrl}/health`);
    const duration = Date.now() - start;
    if (response.ok) {
      const data = await response.json();
      return res.json({
        status: 'Connected',
        service: 'FastAPI AI Microservice',
        latencyMs: duration,
        response: data
      });
    } else {
      return res.json({
        status: 'Error',
        service: 'FastAPI AI Microservice',
        statusCode: response.status,
        message: 'FastAPI responded but returned an error status code'
      });
    }
  } catch (error) {
    return res.json({
      status: 'Disconnected',
      service: 'FastAPI AI Microservice',
      message: error.message
    });
  }
});

export default router;
