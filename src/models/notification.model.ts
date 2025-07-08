import mongoose, { Schema, Document } from "mongoose";

export interface NotificationInterface extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "message" | "trip" | "system";
  relatedTripId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<NotificationInterface>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["message", "trip", "system"],
    required: true,
  },
  relatedTripId: { type: Schema.Types.ObjectId, ref: "Trip" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<NotificationInterface>(
  "Notification",
  notificationSchema
);
