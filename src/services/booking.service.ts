import { AppError } from '../utils/error';
import { Booking, BookingInterface } from '../models/booking.model';
import mongoose from 'mongoose';
import { User } from '../models/user.model';

export const createBookingService = async (bookingData: BookingInterface) => {
    const user = await User.findById(bookingData.userId)
    if(!user){
        throw new AppError('User ID Invalid', 404)
    }
  return await Booking.create(bookingData);
};

export const getBookingsService = async (filter = {}) => {
  return await Booking.find(filter)
    .populate('userId', '-password')
    .populate('tripId');
};

export const getPassengersByDriverIdService = async (driverId: string) => {
  const bookings = await Booking.find()
    .populate({
      path: 'tripId',
      populate: {
        path: 'driverId',
      },
    })
    .populate('userId', '-password');

  const filteredBookings = bookings.filter((booking) => {
    const trip = booking.tripId as any;
    if (!trip || !trip.driverId) return false;
    return (
      trip.driverId._id?.toString() === driverId.toString() ||
      trip.driverId?.toString() === driverId.toString()
    );
  });

  const passengers = filteredBookings.map((booking) => booking.userId);

  return passengers;
};

export const getBookingsByDriverIdService = async (driverId: string) => {
  const bookings = await Booking.find()
    .populate({
      path: 'tripId',
      populate: {
        path: 'driverId',
      }
    })
    .populate('userId', '-password');


  const filteredBookings = bookings.filter((booking) => {
    const trip = booking.tripId as any;
    if (!trip || !trip.driverId) return false;

    return trip.driverId._id?.toString() === driverId.toString() || trip.driverId?.toString() === driverId.toString();
  });

  return filteredBookings;
};

export const getBookingsPendingByDriverIdService = async (driverId: string) => {
  const bookings = await Booking.find()
    .populate({
        path: 'tripId',
        populate: [
        { path: 'driverId' },
        { path: 'destinationId' }
        ],
    })
    .populate('userId', '-password');

  const filteredBookings = bookings.filter((booking) => {
    const trip = booking.tripId as any;
    if (!trip || !trip.driverId) return false;

    const driverMatches =
      trip.driverId._id?.toString() === driverId.toString() ||
      trip.driverId?.toString() === driverId.toString();

    const statusMatches = booking.status === 'pending';

    return driverMatches && statusMatches;
  });

  return filteredBookings;
};

export const getBookingsByStudentIdService = async (userId: string) => {
  const bookings = await Booking.find({ userId })
    .populate('userId', '-password')
    .populate({
      path: 'tripId',
    populate: [
        { path: 'driverId' },
        { path: 'destinationId' }
        ],
    });

  return bookings;
};


export const driverAcceptBookingService = async (bookingId: string, driverId: string) => {
  const booking = await Booking.findById(bookingId).populate('tripId', 'driverId');
  if (!booking) throw new AppError("Booking not found", 404);

  if (booking.status !== "pending") {
    throw new AppError(`Cannot accept booking with status '${booking.status}'`, 400);
  }

  const trip: any = booking.tripId;
  if (trip.driverId.toString() !== driverId) {
    throw new AppError("You are not the assigned driver for this trip", 403);
  }

  booking.status = "confirmed";
  await booking.save();
  return booking;
};

export const driverRejectBookingService = async (bookingId: string, driverId: string) => {
  const booking = await Booking.findById(bookingId).populate('tripId', 'driverId');
  if (!booking) throw new Error("Booking not found");

  if (booking.status !== "pending") {
    throw new Error(`Cannot reject booking with status '${booking.status}'`);
  }

  const trip: any = booking.tripId;
  if (trip.driverId.toString() !== driverId) {
    throw new Error("You are not the assigned driver for this trip");
  }

  booking.status = "rejected";
  await booking.save();
  return booking;
};


export const getBookingService = async (bookingId: string) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new AppError('Invalid booking ID', 400);
  }
  return await Booking.findById(bookingId)
    .populate('userId', '-password')
    .populate('tripId');
};

export const getBookingRelatedUserService = async (userId: string) => {
  return await Booking.find({ userId })
    .populate('tripId')
    .sort({ bookingDate: -1 });
};

export const getBookByTripService = async (tripId: string) => {
  return await Booking.find({ tripId, status: { $ne: 'cancelled' } })
    .populate('userId', '-password')
    .sort({ bookingDate: 1 });
};

export const updateBookingService = async (bookingId: string, updateData: Partial<BookingInterface>) => {
  return await Booking.findByIdAndUpdate(bookingId, updateData, { 
    new: true,
  });
};

export const cancelBookingService = async (bookingId: string, cancellationReason: string) => {
  return await Booking.findByIdAndUpdate(bookingId, { 
    status: 'cancelled',
    cancellationReason,
  }, { new: true });
};

export const deleteBookingService = async (bookingId: string) => {
  return await Booking.findByIdAndDelete(bookingId);
};