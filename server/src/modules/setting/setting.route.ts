import Elysia from 'elysia';
import { basescan } from '../../utils/basescan';

export const settingRouter = new Elysia({ prefix: '/setting' });

settingRouter.get('/', async () => {
  const setting = {
    etherPrice: await basescan.getEtherLastPrice(),
  };
  return { data: setting };
});
