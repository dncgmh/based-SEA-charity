import mongoose from 'mongoose';
import { transactionModel } from '../transaction/transaction.model';

async function getFeaturedCharities() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const aggregationPipeline = [
    {
      $match: {
        type: 'donate',
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: '$charityId',
        totalDonated: { $sum: '$amount' },
        donationCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalDonated: -1, donationCount: -1 },
    },
    {
      $limit: 6,
    },
    {
      $project: {
        _id: '$_id',
        totalDonated: '$totalDonated',
        donationCount: '$donationCount',
      },
    },
  ];

  try {
    const featuredCharities = await transactionModel.aggregate(aggregationPipeline);
    return featuredCharities;
  } catch (error) {
    console.error('Error in getFeaturedCharities:', error);
    throw error;
  }
}

export const charityService = {
  getFeaturedCharities,
};
