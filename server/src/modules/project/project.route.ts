import Elysia, { t } from 'elysia';
import { projectModel } from './project.model';
import slug from 'slug';
import { authPlugin } from '../../plugins/auth';
import { uploadImage } from '../../utils/cloudinary';
import { abi } from '../../../../smart-contract/artifacts/contracts/ChairtyProjectDonation.sol/CharityProjectDonation.json';
import { wagmiConfig } from '../../config/wagmi.config';
import { readContract } from '@wagmi/core';
import { transactionService } from '../transaction/transaction.service';
import { projectService } from './project.service';

export const projectRouter = new Elysia({ prefix: '/project' });

projectRouter.get('/', async ({ query: { pageSize, pageNumber, charityId, status } }) => {
  const skipValue = pageNumber ? (Number(pageNumber) - 1) * Number(pageSize) : 0;
  const query: any = {};
  if (charityId) {
    query.charityId = charityId;
  }
  if (status) {
    if (status === 'ongoing') {
      query.endDate = { $gte: new Date() };
      query.startDate = { $lte: new Date() };
    }
    if (status === 'ended') {
      query.endDate = { $lt: new Date() };
    }
  }
  const projects = await projectModel.find(query).skip(skipValue).limit(Number(pageSize)).populate('charity', 'name logo');
  const total = await projectModel.countDocuments(query);
  await Promise.all(
    projects.map(async (project) => {
      const statsData = await transactionService.getStats({ projectId: project.id });
      project.stats = statsData;
    }),
  );
  return {
    data: projects,
    total,
  };
});

projectRouter.get('/featured', async () => {
  const featuredProjects = await projectService.getFeaturedProjects();
  const projects = await projectModel.find({ _id: { $in: featuredProjects.map((project) => project._id) } }).populate('charity', 'name logo');
  await Promise.all(
    projects.map(async (project) => {
      const statsData = await transactionService.getStats({ projectId: project.id });
      project.stats = statsData;
    }),
  );
  return {
    data: projects,
  };
});

projectRouter.get('/:id', async ({ params: { id } }) => {
  const project = await projectModel.findById(id);
  if (!project) {
    throw new Error('Project not found!');
  }
  const statsData = await transactionService.getStats({ projectId: project.id });
  project.stats = statsData;
  return { data: project };
});

projectRouter.get('/slug/:slug', async ({ params: { slug } }) => {
  const project = await projectModel.findOne({ slug });
  if (!project) {
    throw new Error('Project not found!');
  }
  const statsData = await transactionService.getStats({ projectId: project.id });
  project.stats = statsData;
  return { data: project };
});

projectRouter.use(authPlugin).post(
  '/',
  async ({ body, payload: charity }) => {
    const images = await Promise.all(
      body.images.map(async (image) => {
        const imageData = await uploadImage(await image.arrayBuffer());
        return imageData.url;
      }),
    );
    const slugName = slug(body.title).slice(0, 50) + Math.random().toString().substring(2, 7);
    const newProject = await projectModel.create({ ...body, images, charityId: charity._id, slug: slugName });
    return {
      data: newProject,
    };
  },
  {
    type: 'formdata',
    body: t.Object({
      title: t.String(),
      description: t.String(),
      images: t.Files(),
      tags: t.Optional(t.Array(t.String())),
      startDate: t.String(),
      endDate: t.String(),
      targetAmount: t.String(),
    }),
    transform({ body }) {
      if (body.images && !Array.isArray(body.images)) {
        body.images = [body.images as any];
      }
      if (body.tags && !Array.isArray(body.tags)) {
        body.tags = [body.tags];
      }
    },
  },
);

projectRouter.use(authPlugin).put(
  '/:id',
  async ({ params: { id }, body, payload: charity }) => {
    const project = await projectModel.findOne({ _id: id, charityId: charity._id });
    if (!project) {
      throw new Error('Project not found!');
    }
    const updateData: any = { ...body };
    if (body.images) {
      const images = await Promise.all(
        body.images.map(async (image) => {
          if (typeof image === 'string') {
            return image;
          }
          const imageData = await uploadImage(await image.arrayBuffer());
          return imageData.url;
        }),
      );
      updateData.images = images;
    }
    if (body.contractAddress) {
      const result = await readContract(wagmiConfig, {
        abi,
        address: body.contractAddress as any,
        functionName: 'projectId',
      });
      if (result !== project._id.toString()) {
        throw new Error('Invalid contract address!');
      }
    }
    const updatedProject = await projectModel.findOneAndUpdate({ _id: project._id }, updateData, { new: true });
    return { data: updatedProject };
  },
  {
    body: t.Object({
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      images: t.Optional(t.Array(t.Union([t.String(), t.File()]))),
      tags: t.Optional(t.Array(t.String())),
      contractAddress: t.Optional(t.String()),
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
      targetAmount: t.Optional(t.String()),
    }),
    transform({ body }) {
      if (body.images && !Array.isArray(body.images)) {
        body.images = [body.images as any];
      }
      if (body.tags && !Array.isArray(body.tags)) {
        body.tags = [body.tags];
      }
    },
  },
);

projectRouter.get('/:id/stats', async ({ params: { id } }) => {
  // const stats = await transactionModel.aggregate([{ $match: { projectId: id } }, { $group: { _id: '$type', total: { $sum: '$amount' } } }]);
});
