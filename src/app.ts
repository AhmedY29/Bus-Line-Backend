import express, { Express, Request, Response, NextFunction } from 'express';
import logger from './utils/logger';
import dotenv from 'dotenv';
import { connectDB } from './config/connectDB';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

// Route imports
import authRoutes from './routes/auth.route';
// import driverRoutes from './routes/driver.route';
// import busRoutes from './routes/bus.route';
// import tripRoutes from './routes/trip.route';
// import bookingRoutes from './routes/booking.route';
// import trackingRoutes from './routes/tracking.route';
// import ratingRoutes from './routes/rating.route';
// import adminRoutes from './routes/admin.route';
// import chatRoutes from './routes/chat.route';

const app: Express = express();

dotenv.config();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/trips', tripRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/rating', ratingRoutes);



app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to BusLine API - School Transportation Management System',
  });
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.stack);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  connectDB()
});
