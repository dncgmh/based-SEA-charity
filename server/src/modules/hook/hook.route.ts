import { parseAbiItem, decodeEventLog, formatEther } from 'viem';
import crypto from 'node:crypto';
import Elysia from 'elysia';
import { logger } from '../../utils/logger';
import { projectModel } from '../project/project.model';
import { transactionModel } from '../transaction/transaction.model';

function isValidSignatureForStringBody(
  body: string, // must be raw string body, not json transformed version of the body
  signature: string, // your "X-Alchemy-Signature" from header
  signingKey: string, // taken from dashboard for specific webhook
): boolean {
  const hmac = crypto.createHmac('sha256', signingKey); // Create a HMAC SHA256 hash using the signing key
  hmac.update(body, 'utf8'); // Update the token hash with the request body using utf8
  const digest = hmac.digest('hex');
  return signature === digest;
}

export const hookRouter = new Elysia({ prefix: '/hook' });

hookRouter.post('/alchemy/donations', async ({ body }: { body: any }) => {
  // logger.info('Webhook received', body);
  const log = body.event.data.block.logs[0];
  if (!log) {
    return { data: 'ok' };
  }
  const txData = log.transaction;

  const to = txData.to.address;
  const from = txData.from.address;
  logger.info(to, from);

  const project = await projectModel.findOne({
    contractAddress: to,
  });
  if (!project) {
    logger.error('Project not found', { to }, body);
    return { data: 'ok' };
  }

  const eventAbi = parseAbiItem('event DonationReceived(address indexed donor, uint256 amount, string message)');
  const decodedLog = decodeEventLog({
    abi: [eventAbi],
    data: log.data,
    topics: log.topics,
  });
  logger.info(decodedLog);
  logger.info(to, project.contractAddress);
  const transaction = {
    charityId: project.charityId,
    projectId: project._id,
    amount: Number(formatEther(decodedLog.args.amount)),
    txHash: txData.hash,
    status: txData.status === 1 ? 'success' : 'failed',
    message: decodedLog.args.message,
    type: 'donate',
    from: txData.from.address,
    to: txData.to.address,
  };
  logger.info('Transaction', transaction);

  await transactionModel.create(transaction);
  return { data: 'ok' };
});

hookRouter.post('/alchemy/withdraws', async ({ body }: { body: any }) => {
  // logger.info('Webhook received', body);
  const log = body.event.data.block.logs[0];
  if (!log) {
    return { data: 'ok' };
  }
  const txData = log.transaction;

  const to = txData.to.address;
  const from = txData.from.address;
  logger.info(to, from);

  const project = await projectModel.findOne({
    contractAddress: to,
  });
  if (!project) {
    logger.error('Project not found', { to }, body);
    return { data: 'ok' };
  }

  const eventAbi = parseAbiItem('event FundsWithdrawn( address indexed beneficiary, uint256 amount, string purpose)');
  const decodedLog = decodeEventLog({
    abi: [eventAbi],
    data: log.data,
    topics: log.topics,
  });
  logger.info(decodeEventLog);
  logger.info(to, project.contractAddress);
  const transaction = {
    charityId: project.charityId,
    projectId: project._id,
    amount: Number(formatEther(decodedLog.args.amount)),
    txHash: txData.hash,
    status: txData.status === 1 ? 'success' : 'failed',
    message: decodedLog.args.purpose,
    type: 'withdraw',
    from: txData.from.address,
    to: txData.to.address,
  };
  logger.info('Transaction', transaction);

  await transactionModel.create(transaction);
  return { data: 'ok' };
});
