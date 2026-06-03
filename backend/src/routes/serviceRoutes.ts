import { Router } from 'express';
import { createService, listServices } from '../controllers/serviceController.js';
import { authenticate } from '../middlewares/authenticate.js';

export const serviceRoutes = Router();

serviceRoutes.get('/', listServices);
serviceRoutes.post('/', authenticate, createService);
