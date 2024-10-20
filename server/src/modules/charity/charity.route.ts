import Elysia, { t } from 'elysia';
import { verifyMessage } from '@wagmi/core';
import { charityModel } from './charity.model';
import { wagmiConfig } from '../../config/wagmi.config';
import slug from 'slug';
import { uploadImage } from '../../utils/cloudinary';
import { transactionService } from '../transaction/transaction.service';
import { charityService } from './charity.service';
import { authPlugin } from '../../plugins/auth';
import { config } from '../../config';

export const charityRouter = new Elysia({ prefix: '/charity' });

charityRouter.get('/', async ({ query: { pageSize, pageNumber, onchainAddress, type } }) => {
  const skipValue = pageNumber ? (Number(pageNumber) - 1) * Number(pageSize) : 0;
  const query: any = {};
  if (onchainAddress) {
    query.onchainAddress = onchainAddress;
  }
  if (type) {
    query.type = type;
  }
  const charities = await charityModel.find(query).skip(skipValue).limit(Number(pageSize));
  await Promise.all(
    charities.map(async (charity) => {
      const statsData = await transactionService.getStats({ charityId: charity.id });
      charity.stats = statsData;
    }),
  );
  const total = await charityModel.countDocuments(query);
  return {
    data: charities,
    total,
  };
});

charityRouter.get('/:id', async ({ params: { id } }) => {
  const charity = await charityModel.findById(id);
  if (!charity) {
    throw new Error('Charity not found');
  }
  const statsData = await transactionService.getStats({ charityId: charity.id });
  charity.stats = statsData;
  return { data: charity };
});

charityRouter.get('/featured', async () => {
  const featuredCharities = await charityService.getFeaturedCharities();
  const isLessThanDisplayLimit = featuredCharities.length < config.app.display.featuredCharities;
  const charities = await charityModel.find({ _id: { $in: featuredCharities.map((charity) => charity._id) } });
  if (isLessThanDisplayLimit) {
    const remainingCharities = await charityModel
      .find({ _id: { $nin: featuredCharities.map((charity) => charity._id) } })
      .sort('-createdAt')
      .limit(config.app.display.featuredCharities - featuredCharities.length);
    charities.push(...remainingCharities);
  }
  await Promise.all(
    charities.map(async (charity) => {
      const statsData = await transactionService.getStats({ charityId: charity.id });
      charity.stats = statsData;
    }),
  );
  return {
    data: charities,
  };
});

charityRouter.get('/slug/:slug', async ({ params: { slug } }) => {
  const charity = await charityModel.findOne({ slug });
  if (!charity) {
    throw new Error('Charity not found');
  }
  const statsData = await transactionService.getStats({ charityId: charity.id });
  charity.stats = statsData;
  return { data: charity };
});

charityRouter.post(
  '/',
  async ({ body, signJWT }) => {
    const isAuthorized = verifyMessage(wagmiConfig, {
      address: body.onchainAddress as any,
      message: body.message,
      signature: body.signature as any,
    });
    if (!isAuthorized) {
      throw new Error('Invalid signature!');
    }
    const logoData = await uploadImage(await body.logo.arrayBuffer());
    const slugName = slug(body.name).slice(0, 50) + Math.random().toString().substring(2, 7);
    const newCharity = await charityModel.create({ ...body, logo: logoData.url, slug: slugName });
    const accessToken = await signJWT({
      _id: newCharity._id,
      address: newCharity.onchainAddress,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    return {
      data: newCharity,
      accessToken,
    };
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.String(),
      address: t.Optional(t.String()),
      phoneNumber: t.Optional(t.String()),
      email: t.Optional(t.String()),
      links: t.Optional(
        t.Array(
          t.Object({
            type: t.String(),
            url: t.String(),
          }),
        ),
      ),
      type: t.Enum({ individual: 'individual', organization: 'organization', government: 'government' }),
      logo: t.File(),
      onchainAddress: t.String(),
      signature: t.String(),
      message: t.String(),
    }),
    transform({ body }) {
      if (typeof body.links === 'string') {
        body.links = JSON.parse(body.links);
      }
    },
  },
);

charityRouter.post(
  '/login',
  async ({ body, signJWT }) => {
    const isAuthorized = verifyMessage(wagmiConfig, {
      address: body.onchainAddress as any,
      message: body.message,
      signature: body.signature as any,
    });
    if (!isAuthorized) {
      throw new Error('Invalid signature!');
    }
    const charity = await charityModel.findOne({ onchainAddress: body.onchainAddress });
    if (!charity) {
      throw new Error('Charity not found');
    }
    const accessToken = await signJWT({
      _id: charity._id,
      address: charity.onchainAddress,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    return {
      data: charity,
      accessToken,
    };
  },
  {
    body: t.Object({
      onchainAddress: t.String(),
      signature: t.String(),
      message: t.String(),
    }),
  },
);

charityRouter.use(authPlugin).put(
  '/:id',
  async ({ params: { id }, body, payload: charity }) => {
    if (id !== charity._id) {
      throw new Error('Unauthorized');
    }
    const updateData: Record<string, any> = { ...body };
    if (body.logo) {
      const logoData = await uploadImage(await body.logo.arrayBuffer());
      updateData.logo = logoData.url;
    }
    const updatedCharity = await charityModel.findByIdAndUpdate(id, updateData, { new: true });
    return { data: updatedCharity };
  },
  {
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      address: t.Optional(t.String()),
      phoneNumber: t.Optional(t.String()),
      email: t.Optional(t.String()),
      links: t.Optional(
        t.Array(
          t.Object({
            type: t.String(),
            url: t.String(),
          }),
        ),
      ),
      type: t.Optional(t.Enum({ individual: 'individual', organization: 'organization', government: 'government' })),
      logo: t.Optional(t.File()),
    }),
    transform({ body }) {
      if (typeof body.links === 'string') {
        body.links = JSON.parse(body.links);
      }
    },
  },
);
