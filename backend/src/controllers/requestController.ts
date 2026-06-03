import type { Response } from 'express';
import type { ServiceRequest } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { addDays, toDate } from '../lib/date.js';
import type { RequestWithAuth } from '../types.js';

type IncomingRequest = {
  orderDate?: string;
  requestNumber?: string;
  serviceId?: number | string;
  status?: string;
  price?: number | string;
  expectedDate?: string;
};

function serializeRequest(request: ServiceRequest) {
  return {
    id: request.id,
    orderDate: request.orderDate,
    requestNumber: request.requestNumber,
    serviceId: request.serviceId,
    serviceName: request.serviceName,
    status: request.status,
    price: request.price,
    expectedDate: request.expectedDate
  };
}

async function resolveClientFromLogin(login?: string, fallbackClientId?: number) {
  if (login) {
    return prisma.client.findUnique({ where: { email: String(login).toLowerCase() } });
  }
  if (fallbackClientId) {
    return prisma.client.findUnique({ where: { id: fallbackClientId } });
  }
  return null;
}

export async function listRequests(req: RequestWithAuth, res: Response) {
  const login = typeof req.query.login === 'string' ? req.query.login : req.auth?.email;
  const client = await resolveClientFromLogin(login, req.auth?.clientId);

  if (!client) {
    return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
  }

  const requests = await prisma.serviceRequest.findMany({
    where: { clientId: client.id },
    orderBy: { orderDate: 'asc' }
  });

  return res.json({ success: true, requests: requests.map(serializeRequest) });
}

export async function updateRequests(req: RequestWithAuth, res: Response) {
  const { login, requests } = req.body as { login?: string; requests?: IncomingRequest[] };
  const client = await resolveClientFromLogin(login || req.auth?.email, req.auth?.clientId);

  if (!client) {
    return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
  }

  if (!Array.isArray(requests)) {
    return res.status(400).json({ success: false, message: 'A lista de solicitações é obrigatória.' });
  }

  const serviceIds = requests.map((request) => Number(request.serviceId));
  const services = await prisma.service.findMany({ where: { id: { in: serviceIds } } });
  const servicesById = new Map(services.map((service) => [service.id, service]));

  const data = [];
  for (const request of requests) {
    const service = servicesById.get(Number(request.serviceId));
    const orderDate = toDate(request.orderDate);
    const expectedDate = toDate(request.expectedDate);

    if (!service || !orderDate || !expectedDate || !request.requestNumber) {
      return res.status(400).json({ success: false, message: 'Lista de solicitações inválida.' });
    }

    data.push({
      clientId: client.id,
      serviceId: service.id,
      requestNumber: String(request.requestNumber),
      serviceName: service.name,
      status: request.status || 'EM ELABORAÇÃO',
      price: Number(request.price ?? service.price),
      orderDate,
      expectedDate
    });
  }

  const transaction = [prisma.serviceRequest.deleteMany({ where: { clientId: client.id } })];
  if (data.length > 0) {
    transaction.push(prisma.serviceRequest.createMany({ data }));
  }

  await prisma.$transaction(transaction);

  return res.json({ success: true });
}

export async function createRequest(req: RequestWithAuth, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ success: false, message: 'Token de autenticação não informado.' });
  }

  const { serviceId } = req.body as { serviceId?: number | string };
  const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });

  if (!service) {
    return res.status(400).json({ success: false, message: 'Serviço de TI inválido.' });
  }

  const existingCount = await prisma.serviceRequest.count({ where: { clientId: req.auth.clientId } });
  const orderDate = new Date();
  const request = await prisma.serviceRequest.create({
    data: {
      clientId: req.auth.clientId,
      serviceId: service.id,
      requestNumber: `REQ-${5001 + existingCount}`,
      serviceName: service.name,
      status: 'EM ELABORAÇÃO',
      price: service.price,
      orderDate,
      expectedDate: addDays(orderDate, service.leadDays)
    }
  });

  return res.status(201).json({ success: true, request: serializeRequest(request) });
}

export async function deleteRequest(req: RequestWithAuth, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ success: false, message: 'Token de autenticação não informado.' });
  }

  const id = Number(req.params.id);
  await prisma.serviceRequest.deleteMany({ where: { id, clientId: req.auth.clientId } });
  return res.json({ success: true });
}
