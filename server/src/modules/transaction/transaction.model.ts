import mongoose from 'mongoose';

const Transaction = new mongoose.Schema(
  {
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'charity',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    message: {
      type: String,
    },
    type: {
      type: String,
      enum: ['donate', 'withdraw'],
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const transactionModel = mongoose.model('transaction', Transaction);
