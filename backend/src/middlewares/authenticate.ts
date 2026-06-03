import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthPayload, RequestWithAuth } from '../types.js';

export function authenticate(req: RequestWithAuth, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token de autenticação não informado.' });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as AuthPayload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token de autenticação inválido.' });
  }
}
