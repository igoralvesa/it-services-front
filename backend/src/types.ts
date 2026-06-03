import type { Request } from 'express';

export type AuthPayload = {
  clientId: number;
  email: string;
  fullName: string;
};

export type RequestWithAuth = Request & {
  auth?: AuthPayload;
};
