import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    provider: { type: String, enum: ['zoho_books'], required: true },
    isActive: { type: Boolean, default: false },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    organizationId: { type: String },
    organizationName: { type: String },
    connectedAt: { type: Date },
    connectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

integrationSchema.index({ store: 1, provider: 1 }, { unique: true });

export default mongoose.model('Integration', integrationSchema);
