import Elysia, { t } from 'elysia';
import { transactionModel } from './transaction.model';

export const transactionRouter = new Elysia({ prefix: '/transaction' });

transactionRouter.get(
  '/',
  async ({ query: { pageSize, pageNumber, charityId, projectId, type } }) => {
    const skipValue = pageNumber ? (Number(pageNumber) - 1) * Number(pageSize) : 0;

    const query: any = {};
    if (charityId) {
      query.charityId = charityId;
    }
    if (projectId) {
      query.projectId = projectId;
    }
    if (type) {
      query.type = type;
    }
    const transactions = await transactionModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skipValue)
      .limit(Number(pageSize));
    const total = await transactionModel.countDocuments(query);
    return {
      data: transactions,
      total,
    };
  },
  {
    query: t.Object({
      pageSize: t.Optional(t.Numeric()),
      pageNumber: t.Optional(t.Numeric()),
      charityId: t.Optional(t.String()),
      projectId: t.Optional(t.String()),
      type: t.Optional(t.String()),
    }),
  },
);
