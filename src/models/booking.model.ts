import mongoose, { Schema } from "mongoose";

export interface BookingInterface {
  userId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  subscriptionStart?: Date;
  subscriptionEnd?: Date;
  cancellationReason?: string;
}

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  subscriptionStart: { type: Date },
  subscriptionEnd: { type: Date },
  cancellationReason: { type: String }
}, {
  timestamps: true,
});

export const Booking = mongoose.model<BookingInterface>('Booking', BookingSchema);