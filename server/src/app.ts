import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import departmentRoutes from './routes/department.routes';
import positionRoutes from './routes/position.routes';
import holidayRoutes from './routes/holiday.routes';
import masterRoutes from './routes/master.routes';
import shiftRoutes from './routes/shift.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/master', masterRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Absensi API', version: '1.0.0' });
});

// Start Server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
