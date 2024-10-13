import mongoose from 'mongoose';
import { transactionModel } from './transaction.model';

async function getStats({ projectId, charityId }: { projectId?: string; charityId?: string }) {
  const match: Record<string, any> = {};
  if (projectId) {
    match.projectId = new mongoose.Types.ObjectId(projectId);
  }
  if (charityId) {
    match.charityId = new mongoose.Types.ObjectId(charityId);
  }

  const stats = await transactionModel.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        totalDonated: {
          $sum: {
            $cond: [{ $eq: ['$type', 'donate'] }, '$amount', 0],
          },
        },
        donationCount: {
          $sum: {
            $cond: [{ $eq: ['$type', 'donate'] }, 1, 0],
          },
        },
        totalWithdrawn: {
          $sum: {
            $cond: [{ $eq: ['$type', 'withdraw'] }, '$amount', 0],
          },
        },
      },
    },
  ]);
  const statsData = stats[0];
  if (!statsData) {
    return {
      totalDonated: 0,
      donationCount: 0,
      totalWithdrawn: 0,
    };
  }
  return stats[0];
}

export const transactionService = {
  getStats,
};
