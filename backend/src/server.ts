import 'dotenv/config';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { requestRoutes } from './routes/requestRoutes.js';
import { serviceRoutes } from './routes/serviceRoutes.js';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API online' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
};

app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`API running on port ${port}`);
});
