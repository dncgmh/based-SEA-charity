import mongoose from 'mongoose';

const Project = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    link: {
      type: String,
    },
    tags: {
      type: [String],
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'charity',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    contractAddress: {
      type: String,
    },
    stats: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

Project.virtual('charity', {
  ref: 'charity',
  localField: 'charityId',
  foreignField: '_id',
  justOne: true,
});

export const projectModel = mongoose.model('project', Project);
