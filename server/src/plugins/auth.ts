import type Elysia from 'elysia';

export const authPlugin = (app: Elysia) =>
  app.derive(async ({ verifyJWT, headers }) => {
    const authorization = headers.authorization;
    if (!authorization) {
      throw new Error('No authorization header');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new Error('Invalid token');
    }
    const payload = await verifyJWT(token);
    if (!payload) {
      throw new Error('Invalid token');
    }
    return { payload };
  });
