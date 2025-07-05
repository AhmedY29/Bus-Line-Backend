import mongoose, { Schema, Document } from "mongoose";

export interface RatingInterface extends Document {
  driverId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
}

const ratingSchema = new Schema(
  {
    driverId: { type: mongoose.Types.ObjectId, ref: "Driver", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

export const Rating = mongoose.model<RatingInterface>("Rating", ratingSchema);
