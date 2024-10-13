import { transactionModel } from '../transaction/transaction.model';

async function getFeaturedProjects() {
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
        _id: '$projectId',
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
    const featuredProjects = await transactionModel.aggregate(aggregationPipeline);
    return featuredProjects;
  } catch (error) {
    console.error('Error in getFeaturedProjects:', error);
    throw error;
  }
}

export const projectService = {
  getFeaturedProjects,
};
