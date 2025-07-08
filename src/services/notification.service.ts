import { Notification } from "../models/notification.model";
import mongoose from "mongoose";

export const createNotification = async (data: {
  userId: string;
  title: string;
  message: string;
  type: "message" | "trip" | "system";
  relatedTripId?: string;
}) => {
  return await Notification.create({
    ...data,
    userId: new mongoose.Types.ObjectId(data.userId),
    relatedTripId: data.relatedTripId
      ? new mongoose.Types.ObjectId(data.relatedTripId)
      : undefined,
  });
};

export const getUserNotifications = async (userId: string) => {
  return await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(100);
};

export const markAsRead = async (notificationId: string) => {
  return await Notification.findByIdAndUpdate(notificationId, {
    isRead: true,
  });
};

export const markAllAsRead = async (userId: string) => {
  return await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};
