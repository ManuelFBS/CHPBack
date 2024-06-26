import express, { Application } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authSuperAdmin from './routes/auth-SupAdm.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import articleRoutes from './routes/articles.routes';
//
dotenv.config();

const app: Application = express();

// Settings...
app.set('port', process.env.PORT || 8585 || 3000);

// Middlewares...
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes...
app.use('/api/supadm', authSuperAdmin);
app.use('/api/auth', authRoutes);
app.use('/api/owner', articleRoutes);
app.use('/api/users', usersRoutes);

export default app;
