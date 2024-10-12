import cors from '@elysiajs/cors';
import jwt from '@elysiajs/jwt';
import { Elysia } from 'elysia';
import logixlysia from 'logixlysia';
import { connectDB } from './bootstrap/mongodb';
import { charityRouter } from './modules/charity/charity.route';
import { projectRouter } from './modules/project/project.route';
import { hookRouter } from './modules/hook/hook.route';
import { logger } from './utils/logger';
import { transactionRouter } from './modules/transaction/transaction.route';
import { subscribe } from './utils/subscribers';
import { settingRouter } from './modules/setting/setting.route';
import { config } from './config';
const app = new Elysia();

app.onError(({ error }) => {
  logger.debug(error);
});

app.use(cors());

app.use(
  logixlysia({
    config: {
      showStartupMessage: true,
      startupMessageFormat: 'simple',
      ip: true,
      logFilePath: './logs/request.log',
      customLogFormat: '🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}',
      logFilter: {
        method: 'GET',
      },
    },
  }),
);
app
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwt.secret!,
      exp: config.jwt.expiresIn,
    }),
  )
  .derive(({ jwt }) => ({
    signJWT: async (payload: any) => {
      const token = await jwt.sign(payload);
      return `jwt ${token}`;
    },
    verifyJWT: (token: string) => jwt.verify(token),
  }));

app.group('/api', (app) => {
  app.use(charityRouter);
  app.use(projectRouter);
  app.use(hookRouter);
  app.use(transactionRouter);
  app.use(settingRouter);

  return app;
});

app.listen(config.app.port || 4000);

await connectDB();
subscribe();
