import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  quote: string;
  role?: string;
  isPublished: boolean;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    quote: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);