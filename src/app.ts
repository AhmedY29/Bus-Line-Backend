import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import logger from './utils/logger';
import { connectDB } from './config/connectDB';
import { verifyToken } from './utils/generateToken';
import { getDistanceFromLatLonInKm } from './utils/geo';

// Models
import { Booking } from './models/booking.model';

// Routes
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import tripRoutes from './routes/trip.route';
import ratingRoutes from './routes/rating.route';
import destinationRoutes from './routes/destination.route';
import bookingRoutes from './routes/booking.route';
import messageRoutes from './routes/message.route';
import notificationRoutes from './routes/notification.route';

import { createNotification } from './services/notification.service';
import { markAsReadService, sendMessageService } from './services/message.service';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

const onlineUsers = new Map<string, string>();
const notifiedUsers = new Set<string>();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

io.use((socket, next) => {
  const authHeader = socket.handshake.headers.authorization;
  if (!authHeader) {
    return next(new Error('Authentication error: No Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new Error('Authentication error: No token'));
  }

  try {
    const payload = verifyToken(token);
    socket.data.userId = payload.userId;
    socket.data.role = payload.role;
    logger.info(`Socket auth success: user=${payload.userId}, role=${payload.role}`);
    next();
  } catch (err) {
    logger.error('Socket authentication failed', err);
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket events
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  const userRole = socket.data.role;

  logger.info(`User connected - ID: ${userId}, Role: ${userRole}, SocketID: ${socket.id}`);

  onlineUsers.set(userId, socket.id);
  io.emit('user-connected', userId);
  socket.emit('online-users', Array.from(onlineUsers.keys()));
  socket.join(`user_${userId}`);

  if (userRole === 'driver') {
    socket.join('drivers_room');

    socket.on('driver-location', async (location: { lat: number; lng: number }) => {
      logger.info(`Driver ${userId} sent location: ${JSON.stringify(location)}`);
      io.emit('driver-location-update', {
        driverId: userId,
        location,
      });

      try {
        const activeBookings = await Booking.find({ driverId: userId })
          .populate('userId','-password');



          for (const booking of activeBookings) {
            const user: any = booking.userId;
            if (!user || !user.address || !user.address.coordinate) continue;

            const userLat = user.address.coordinate.lat;
            const userLng = user.address.coordinate.lng;

            const distance = getDistanceFromLatLonInKm(
              location.lat,
              location.lng,
              userLat,
              userLng
            );

          const notifyKey = `${booking.tripId}_${booking.userId}`;
          if (distance <= 3) {
            if (!notifiedUsers.has(notifyKey)) {
              io.to(`user_${booking.userId}`).emit('bus-nearby', {
                tripId: booking.tripId,
                distance: distance.toFixed(2),
                message: `🚍 الباص اقترب (${distance.toFixed(2)} كم) من موقعك.`,
              });
              logger.info(`Bus is near user ${booking.userId} (distance=${distance.toFixed(2)}km)`);
                    await createNotification({
                          userId: booking.userId.toString(),
                          title: 'Bus is Near You',
                          message: `The bus is ${distance.toFixed(2)} km away from your location.`,
                          type: 'trip',
                      });
              notifiedUsers.add(notifyKey);
            }
          } else {
            if (notifiedUsers.has(notifyKey)) {
              notifiedUsers.delete(notifyKey);
            }
          }
        }
      } catch (err) {
        logger.error('Error while checking bus proximity:', err);
      }
    });
  }

  socket.on('join-trip', (tripId: string) => {
    socket.join(`trip_${tripId}`);
    logger.info(`User ${userId} joined trip room: ${tripId}`);
  });

  socket.on(
    'send-message',
    async (data: { tripId: string; receiverId: string; content: string }) => {
      try {
        const { tripId, receiverId, content } = data;

        const message = await sendMessageService({
          senderId: userId,
          receiverId,
          tripId,
          content,
        });

        io.to(`user_${receiverId}`).to(`trip_${tripId}`).emit('new-message', message);
            await createNotification({
            userId: receiverId,
            title: 'New Message',
            message: content,
            type: 'message',
          });
        logger.info(`Message sent from ${userId} to ${receiverId} in trip ${tripId}`);
      } catch (error) {
        logger.error('Message sending error:', error);
        socket.emit('error', 'Failed to send message');
      }
    }
  );

  socket.on('mark-as-read', async (messageId: string) => {
    await markAsReadService(messageId, userId);
  });

  socket.on('get-online-users', () => {
    socket.emit('online-users', Array.from(onlineUsers.keys()));
  });

  socket.on('disconnect', (reason) => {
    logger.info(`User disconnected - ID: ${userId}, Reason: ${reason}`);
    onlineUsers.delete(userId);
    io.emit('user-disconnected', userId);
  });

  socket.on('error', (error) => {
    logger.error(`Socket error for user ${userId}:`, error);
  });
});

app.set('io', io);

app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(
  morgan('tiny', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destination', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to BusLine API - School Transportation Management System',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  connectDB();
});

export { app, io };
