import mongoose, { Document, Schema } from 'mongoose';

export interface IContactLead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  source: 'contact-form' | 'hero-form';
}

const ContactLeadSchema = new Schema<IContactLead>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    interest: { type: String },
    message: { type: String },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    source: { type: String, enum: ['contact-form', 'hero-form'], default: 'contact-form' },
  },
  { timestamps: true }
);

export default mongoose.model<IContactLead>('ContactLead', ContactLeadSchema);