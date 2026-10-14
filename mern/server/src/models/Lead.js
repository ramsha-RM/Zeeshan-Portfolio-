import mongoose from 'mongoose';

export const LEAD_LIMITS = { name: 100, email: 254, message: 2000 };

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: LEAD_LIMITS.name },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: LEAD_LIMITS.email },
    message: { type: String, default: '', maxlength: LEAD_LIMITS.message }
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
