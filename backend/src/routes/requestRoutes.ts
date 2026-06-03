import { Router } from 'express';
import { createRequest, deleteRequest, listRequests, updateRequests } from '../controllers/requestController.js';
import { authenticate } from '../middlewares/authenticate.js';

export const requestRoutes = Router();

requestRoutes.get('/', authenticate, listRequests);
requestRoutes.post('/', authenticate, createRequest);
requestRoutes.put('/', authenticate, updateRequests);
requestRoutes.delete('/:id', authenticate, deleteRequest);
