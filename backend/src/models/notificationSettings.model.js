import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSettingsSchema = new Schema(
  {
    store:          { type: Schema.Types.ObjectId, ref: 'Store', required: true, unique: true },
    ownerName:      { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },   // e.g. '+919876543210'
    isEnabled:      { type: Boolean, default: false },
    reportTime:     { type: String, default: '22:00' }, // HH:mm (24h), default 10 PM
    timezone:       { type: String, default: 'Asia/Kolkata' },
    updatedBy:      { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export default mongoose.model('NotificationSettings', notificationSettingsSchema);
