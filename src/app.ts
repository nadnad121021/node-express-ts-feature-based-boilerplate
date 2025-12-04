import express  from 'express';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './core/middlewares/error.middleware';
import { loadVersionedRoutes } from './core/utils/versionedRouter';

const app = express();

// --- Middlewares ---
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// --- Health check route ---
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Feature Routes ---
// The modules themselves handle versioned routing (v1/v2) and default version
app.use('/api/users', loadVersionedRoutes('users'));
app.use('/api/auth', loadVersionedRoutes('auth'));
// add more modules here

// --- 404 Handler ---
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Global Error Handler ---
app.use(errorMiddleware);

export default app;
