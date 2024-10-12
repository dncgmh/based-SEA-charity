import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Charity = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  type: {
    type: String,
    enum: ['individual', 'organization'],
  },
  links: {
    type: [LinkSchema],
    default: [],
  },
  logo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  onchainAddress: {
    type: String,
    required: true,
    unique: true,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  stats: {
    type: mongoose.Schema.Types.Mixed,
  },
});

export const charityModel = mongoose.model('charity', Charity);
