import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Client } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type { RequestWithAuth } from '../types.js';

function publicClient(client: Client) {
  return {
    id: client.id,
    email: client.email,
    fullName: client.fullName,
    cpf: client.cpf,
    birthDate: client.birthDate,
    phone: client.phone,
    maritalStatus: client.maritalStatus,
    education: client.education
  };
}

function signToken(client: Client): string {
  return jwt.sign(
    { clientId: client.id, email: client.email, fullName: client.fullName },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );
}

export async function registerClient(req: Request, res: Response) {
  const { email, password, fullName, cpf, birthDate, phone, maritalStatus, education } = req.body;

  if (!email || !password || !fullName || !cpf || !birthDate || !maritalStatus || !education) {
    return res.status(400).json({ success: false, message: 'Dados obrigatórios não preenchidos.' });
  }

  const existingClient = await prisma.client.findUnique({ where: { email: String(email).toLowerCase() } });
  if (existingClient) {
    return res.status(409).json({ success: false, message: 'Este login já está cadastrado.' });
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);
  await prisma.client.create({
    data: {
      email: String(email).toLowerCase(),
      password: hashedPassword,
      fullName: String(fullName),
      cpf: String(cpf),
      birthDate: new Date(String(birthDate)),
      phone: phone ? String(phone) : null,
      maritalStatus: String(maritalStatus),
      education: String(education)
    }
  });

  return res.status(201).json({ success: true });
}

export async function login(req: Request, res: Response) {
  const { email, login: loginEmail, password } = req.body;
  const clientEmail = String(email || loginEmail || '').toLowerCase();

  if (!clientEmail || !password) {
    return res.status(400).json({ success: false, authenticated: false, message: 'Login e senha são obrigatórios.' });
  }

  const client = await prisma.client.findUnique({ where: { email: clientEmail } });
  if (!client) {
    return res.status(200).json({ success: true, authenticated: false });
  }

  const passwordMatches = await bcrypt.compare(String(password), client.password);
  if (!passwordMatches) {
    return res.status(200).json({ success: true, authenticated: false });
  }

  return res.json({
    success: true,
    authenticated: true,
    token: signToken(client),
    client: publicClient(client)
  });
}

export async function changePassword(req: Request, res: Response) {
  const { email, login: loginEmail, currentPassword, newPassword } = req.body;
  const clientEmail = String(email || loginEmail || '').toLowerCase();

  if (!clientEmail || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Login, senha atual e nova senha são obrigatórios.' });
  }

  const client = await prisma.client.findUnique({ where: { email: clientEmail } });
  if (!client) {
    return res.status(400).json({ success: false, message: 'Autenticação inválida.' });
  }

  const passwordMatches = await bcrypt.compare(String(currentPassword), client.password);
  if (!passwordMatches) {
    return res.status(400).json({ success: false, message: 'Autenticação inválida.' });
  }

  await prisma.client.update({
    where: { id: client.id },
    data: { password: await bcrypt.hash(String(newPassword), 10) }
  });

  return res.json({ success: true });
}

export async function me(req: RequestWithAuth, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ success: false, message: 'Token de autenticação não informado.' });
  }

  const client = await prisma.client.findUnique({ where: { id: req.auth.clientId } });
  if (!client) {
    return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
  }

  return res.json({ success: true, client: publicClient(client) });
}
