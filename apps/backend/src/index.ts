import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import hospitalRoutes from './routes/hospitalRoutes';
import patientRoutes from './routes/patientRoutes';
import childRoutes from './routes/childRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { User } from './models/User';
import { Hospital } from './models/Hospital';
import { UserRole } from './types';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});


// Security & Middleware Stack
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', apiLimiter);

import masterDataRoutes from './routes/masterDataRoutes';
import authRoutesPrisma from './routes/authRoutesPrisma';
import maternalRoutes from './routes/maternalRoutes';
import ashaRoutes from './routes/ashaRoutes';
import referralRoutes from './routes/referralRoutes';
import laborRoutes from './routes/laborRoutes';
import childRoutesPrisma from './routes/childRoutes';

import analyticsRoutesPrisma from './routes/analyticsRoutes';
import welfareRoutes from './routes/welfareRoutes';

// Route Registries
app.use('/api/v1/master', masterDataRoutes);
app.use('/api/v1/auth', authRoutesPrisma);
app.use('/api/v1/maternal', maternalRoutes);
app.use('/api/v1/asha', ashaRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/referrals', referralRoutes);
app.use('/api/v1/labor', laborRoutes);
app.use('/api/v1/children', childRoutesPrisma);
app.use('/api/v1/analytics', analyticsRoutesPrisma);
app.use('/api/v1/welfare', welfareRoutes);




// Healthcheck Route
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'JANANI360 AI Backend OS',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Seed Initial Data (Karnataka Hospitals & Default Users)
const seedDefaultData = async () => {
  try {
    let phcObj: any = null;
    const hospitalCount = await Hospital.countDocuments();
    if (hospitalCount === 0) {
      const phc = await Hospital.create({
        name: 'Varthur Primary Health Centre (PHC)',
        facilityCode: 'KA-PHC-560087',
        type: 'PHC',
        district: 'Bengaluru Urban',
        taluk: 'Mahadevapura',
        totalBeds: 15,
        availableIcuBeds: 2,
        availableMaternityBeds: 8,
        geoCoordinates: { latitude: 12.9389, longitude: 77.7499 },
        contactPhone: '+91 80 2845 2200'
      });
      phcObj = phc;

      await Hospital.create({
        name: 'Victoria Hospital (BMCRI Tertiary)',
        facilityCode: 'KA-TER-560002',
        type: 'TERTIARY_MEDICAL_COLLEGE',
        district: 'Bengaluru Urban',
        taluk: 'Bangalore East / Fort',
        totalBeds: 500,
        availableIcuBeds: 45,
        availableMaternityBeds: 120,
        geoCoordinates: { latitude: 12.9629, longitude: 77.5752 },
        contactPhone: '+91 80 2670 1150'
      });
    } else {
      phcObj = await Hospital.findOne({ type: 'PHC' });
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const seedUsers = [
        {
          name: 'Dr. Ramesh Kumar (DHO)',
          email: 'dho.ramesh@karnataka.gov.in',
          passwordHash: 'Dho@12345',
          phone: '+91 98450 11223',
          role: UserRole.DISTRICT_OFFICER,
          district: 'Bengaluru Urban',
          isVerified: true
        },
        {
          name: 'Dr. Ananth Viswanath (PHC Medical Officer)',
          email: 'doctor.ananth@karnataka.gov.in',
          passwordHash: 'Doctor@12345',
          phone: '+91 98450 44556',
          role: UserRole.DOCTOR,
          hospitalId: phcObj?._id,
          district: 'Bengaluru Urban',
          isVerified: true
        },
        {
          name: 'Sanveeka Gowda (ASHA Facilitator)',
          email: 'asha.sanveeka@karnataka.gov.in',
          passwordHash: 'Asha@12345',
          phone: '+91 98450 77889',
          role: UserRole.ASHA_WORKER,
          hospitalId: phcObj?._id,
          district: 'Bengaluru Urban',
          isVerified: true
        },
        {
          name: 'Lakshmi Devi (Mother)',
          email: 'mother.lakshmi@gmail.com',
          passwordHash: 'Mother@12345',
          phone: '+91 98450 99000',
          role: UserRole.PATIENT,
          district: 'Bengaluru Urban',
          isVerified: true
        }
      ];

      for (const u of seedUsers) {
        await User.create(u);
      }
      console.log('[Seed] Default seed users created successfully.');
    }
  } catch (err) {
    console.warn('[Seed] Seed execution deferred:', err);
  }
};

// WebSocket Event System
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client Connected: ${socket.id}`);
  
  socket.on('join_hospital_room', (hospitalId) => {
    socket.join(`hospital_${hospitalId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  seedDefaultData();
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 JANANI360 AI Backend OS active on port ${PORT}`);
    console.log(`🏥 Health Endpoint: http://localhost:${PORT}/api/v1/health`);
    console.log(`=======================================================`);
  });
});
