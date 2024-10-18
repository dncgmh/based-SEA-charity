import { createPublicClient, formatEther, parseAbiItem, webSocket } from 'viem';
import { baseSepolia } from 'viem/chains';
import { logger } from './logger';
import { transactionModel } from '../modules/transaction/transaction.model';
import { projectModel } from '../modules/project/project.model';
import { config } from '../config';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: webSocket(config.provider.webSocket),
});

export const subscribe = () => {
  publicClient.watchEvent({
    event: parseAbiItem('event DonationReceived(address indexed donor, uint256 amount, string message)'),
    onLogs: async (logs) => {
      try {
        const log = logs[0];
        if (!log) {
          return;
        }
        const project = await projectModel.findOne({
          contractAddress: log.address,
        });
        if (!project) {
          logger.error('Project not found', log);
          return;
        }
        const transaction = {
          charityId: project.charityId,
          projectId: project._id,
          amount: Number(formatEther(log.args.amount)),
          txHash: log.transactionHash,
          status: 'success',
          message: log.args.message,
          type: 'donate',
          from: log.args.donor,
          to: log.address,
        };
        logger.info('Transaction', transaction);

        await transactionModel.create(transaction);
      } catch (error) {
        logger.error('Failed to create transaction', error);
      }
    },
  });

  publicClient.watchEvent({
    event: parseAbiItem('event FundsWithdrawn( address indexed beneficiary, uint256 amount, string purpose)'),
    onLogs: async (logs) => {
      try {
        const log = logs[0];
        if (!log) {
          return;
        }
        const project = await projectModel.findOne({
          contractAddress: log.address,
        });
        if (!project) {
          logger.error('Project not found', log);
          return;
        }
        const transaction = {
          charityId: project.charityId,
          projectId: project._id,
          amount: Number(formatEther(log.args.amount)),
          txHash: log.transactionHash,
          status: 'success',
          message: log.args.purpose,
          type: 'withdraw',
          from: log.address,
          to: log.args.beneficiary,
        };
        logger.info('Transaction', transaction);

        await transactionModel.create(transaction);
        return;
      } catch (error) {
        logger.error('Failed to create transaction', error);
      }
    },
  });
};
