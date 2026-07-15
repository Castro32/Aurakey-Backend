import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQItem {
  question: string;
  answer: string;
  order: number;
}

export interface IFAQCategory extends Document {
  category: string;
  slug: string;
  order: number;
  items: IFAQItem[];
  isPublished: boolean;
}

const FAQItemSchema = new Schema<IFAQItem>({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
});

const FAQCategorySchema = new Schema<IFAQCategory>(
  {
    category: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    order: { type: Number, default: 0 },
    items: [FAQItemSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFAQCategory>('FAQCategory', FAQCategorySchema);