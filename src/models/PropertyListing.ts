import mongoose, { Document, Schema } from 'mongoose';

export interface IPropertyListing extends Document {
  ownerName: string;
  email: string;
  phone: string;
  propertyType: string;
  location: string;
  price: string;
  bedrooms: string;
  description: string;
  listingType: 'Sale' | 'Rent';
  status: 'pending' | 'reviewed' | 'listed' | 'rejected';
}

const PropertyListingSchema = new Schema<IPropertyListing>(
  {
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    bedrooms: { type: String },
    description: { type: String },
    listingType: { type: String, enum: ['Sale', 'Rent'], required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'listed', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IPropertyListing>('PropertyListing', PropertyListingSchema);