import { Rating } from "../models/rating.model";
import { Driver } from "../models/driver.model";
import mongoose from "mongoose";

export const createRatingService = async (data: any) => {
  const rating = await Rating.create(data);
  await updateDriverAverageRating(data.driverId);
  return rating;
};

export const getDriverRatingsService = async (driverId: string) => {
  return await Rating.find({ driverId }).populate('userId', "-password");
};

export const getRatingService = async (rateId: string) => {
  return await Rating.findById(rateId);
};

export const updateRatingService = async (rateId: string, data: any) => {
  const rating = await Rating.findByIdAndUpdate(rateId, data, { new: true });
  if (rating) {
    await updateDriverAverageRating(rating.driverId.toString());
  }
  return rating;
};

export const deleteRatingService = async (rateId: string) => {
  const rating = await Rating.findByIdAndDelete(rateId);
  if (rating) {
    await updateDriverAverageRating(rating.driverId.toString());
  }
  return rating;
};

export const updateDriverAverageRating = async (driverId: string) => {
  const result = await Rating.aggregate([
    { $match: { driverId: new mongoose.Types.ObjectId(driverId) } },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" },
      },
    },
  ]);

  const average = result[0]?.average || 0;
  await Driver.findByIdAndUpdate(driverId, { rating: average });
  return average;
};
