import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function createService(req: Request, res: Response) {
  const { name, price, leadDays } = req.body;

  if (!name || price === undefined || leadDays === undefined) {
    return res.status(400).json({ success: false, message: 'Todos os dados do serviço são obrigatórios.' });
  }

  const parsedPrice = Number(price);
  const parsedLeadDays = Number(leadDays);

  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0 || !Number.isInteger(parsedLeadDays) || parsedLeadDays < 0) {
    return res.status(400).json({ success: false, message: 'Preço ou prazo inválido.' });
  }

  await prisma.service.create({
    data: {
      name: String(name).trim(),
      price: parsedPrice,
      leadDays: parsedLeadDays
    }
  });

  return res.status(201).json({ success: true });
}

export async function listServices(req: Request, res: Response) {
  const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
  return res.json({ success: true, services });
}
