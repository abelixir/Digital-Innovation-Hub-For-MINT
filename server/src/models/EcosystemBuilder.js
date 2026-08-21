const mongoose = require('mongoose');

const ecosystemBuilderSchema = new mongoose.Schema(
  {
    ownerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    builderType: {
      type: String,
      enum: [
        'incubator',
        'accelerator',
        'coworking',
        'angel_network',
        'university',
        'research',
        'ngo',
        'other',
      ],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    resources: {
      space: { type: Boolean, default: false },
      mentorship: { type: Boolean, default: false },
      fundingSupport: { type: Boolean, default: false },
      training: { type: Boolean, default: false },
      networking: { type: Boolean, default: false },
      other: { type: String, default: '' },
    },
    licenseInfo: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'draft',
        'pending',
        'submitted',
        'under_review',
        'designated',
        'rejected',
        'suspended',
        'revoked',
        'expired',
      ],
      default: 'pending',
    },
    submittedAt: { type: Date, default: null },
    reviewDueAt: { type: Date, default: null },
    designatedAt: { type: Date, default: null },
    designationExpiresAt: { type: Date, default: null }, // 5 years
    certificateNumber: { type: String, default: null },
    rejectionReason: { type: String, default: '' },
    suspensionReason: { type: String, default: '' },
    revocationReason: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

ecosystemBuilderSchema.index({ status: 1, createdAt: -1 });
ecosystemBuilderSchema.index({ ownerUser: 1 });

module.exports = mongoose.model('EcosystemBuilder', ecosystemBuilderSchema);