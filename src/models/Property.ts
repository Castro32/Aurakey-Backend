// import mongoose, { Document, Schema } from 'mongoose';

// export interface IProperty extends Document {
//   title: string;
//   slug: string;
//   badge: string;
//   address: string;
//   description: string;
//   price: string;
//   beds: number;
//   baths: number;
//   sqft: string;
//   year: number;
//   type: 'Mansion' | 'Villa' | 'Luxury' | 'Apartment' | 'Penthouse' | 'Cottage';
//   status: 'For Sale' | 'For Lease' | 'Off-Plan' | 'Sold';
//   images: string[];
//   floorplan?: string;
//   features: string[];
//   isFeatured: boolean;
//   isPublished: boolean;
//   order: number;
// }

// const PropertySchema = new Schema<IProperty>(
//   {
//     title: { type: String, required: true, trim: true },
//     slug: { type: String, required: true, unique: true, lowercase: true },
//     badge: { type: String, required: true },
//     address: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: String, required: true },
//     beds: { type: Number, required: true },
//     baths: { type: Number, required: true },
//     sqft: { type: String, required: true },
//     year: { type: Number, required: true },
//     type: {
//       type: String,
//       enum: ['Mansion', 'Villa', 'Luxury', 'Apartment', 'Penthouse', 'Cottage'],
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['For Sale', 'For Lease', 'Off-Plan', 'Sold'],
//       default: 'For Sale',
//     },
//     images: [{ type: String }],
//     floorplan: { type: String },
//     features: [{ type: String }],
//     isFeatured: { type: Boolean, default: false },
//     isPublished: { type: Boolean, default: true },
//     order: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// PropertySchema.index({ type: 1, status: 1, isPublished: 1 });

// export default mongoose.model<IProperty>('Property', PropertySchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  slug: string;
  developer: string;
  propertyType: 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse';
  city: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ras Al Khaimah';
  area: string;
  startingPrice: string;
  paymentPlan: '60/40' | '70/30' | '80/20' | '50/50' | '1% Monthly' | 'Custom';
  handoverDate: string;
  unitTypes: string[];
  projectStatus: 'New Launch' | 'Available' | 'Coming Soon' | 'Sold Out';
  description?: string;
  images: string[];
  brochureUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    developer: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'],
      required: true,
    },
    city: {
      type: String,
      enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah'],
      required: true,
    },
    area: { type: String, required: true, trim: true },
    startingPrice: { type: String, required: true },
    paymentPlan: {
      type: String,
      enum: ['60/40', '70/30', '80/20', '50/50', '1% Monthly', 'Custom'],
      required: true,
    },
    handoverDate: { type: String, required: true },
    unitTypes: [{ type: String }],
    projectStatus: {
      type: String,
      enum: ['New Launch', 'Available', 'Coming Soon', 'Sold Out'],
      default: 'Available',
    },
    description: { type: String },
    images: [{ type: String }],
    brochureUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PropertySchema.index({ city: 1, projectStatus: 1, isPublished: 1 });

export default mongoose.model<IProperty>('Property', PropertySchema);