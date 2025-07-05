import { AppError } from '../utils/error';
import { Trip, TripInterface } from '../models/trip.model';
import mongoose from 'mongoose';


    export const createTripService = async (tripData: TripInterface) => {
        try {
            const newTrip = new Trip(tripData);
            await newTrip.save();
            return newTrip;
        } catch (error) {
            throw error;
        }
    }

    export const getTripsService = async (filter: any = {}) => {
        try {
            return await Trip.find(filter)
                .populate({
                    path: 'driverId',
                    select:"-password",
                    populate: {
                    path: 'vehicleId'
                }
                })
                .populate('destinationId');
        } catch (error) {
            throw error;
        }
    }
    export const getTripsByDriverIdService = async (driverId: string) => {
        try {
            return await Trip.find({driverId: driverId})
                .populate({
                    path: 'driverId',
                    select:"-password",
                    populate: {
                    path: 'vehicleId'
                }
                })
                .populate('destinationId');
        } catch (error) {
            throw error;
        }
    }

    export const getTripService = async (tripId: string) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(tripId)) {
                throw new AppError('Invalid trip ID', 400);
            }
            
            const trip = await Trip.findById(tripId)
                .populate({
                    path: 'driverId',
                    select:'-password',
                    populate: {
                    path: 'vehicleId'
                },
                })
                .populate('destinationId');
                
            if (!trip) {
                throw new AppError('Trip not found', 404);
            }
            return trip;
        } catch (error) {
            throw error;
        }
    }

 export const updateTripService = async (tripId: string, userId: string, role:string, updateData: Partial<TripInterface>) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            throw new AppError('Invalid trip ID', 400);
        }

        const trip = await Trip.findById(tripId);
        
        if (!trip) {
            throw new AppError('Trip not found', 404);
        }

        if (trip.driverId.toString() !== userId || role == "admin") {
            throw new AppError('Unauthorized: You are not the owner of this trip', 401);
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            updateData,
            { new: true, runValidators: true }
        ).populate({
            path: 'driverId',
            populate: {
            path: 'vehicleId'
        }
        })
         .populate('destinationId');
        
        return updatedTrip;
    } catch (error) {
        throw error;
    }
}

export const deleteTripService = async (tripId: string, userId: string, role:string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            throw new AppError('Invalid trip ID', 400);
        }

        const trip = await Trip.findById(tripId);
        
        if (!trip) {
            throw new AppError('Trip not found', 404);
        }

        if (trip.driverId.toString() !== userId || role == 'admin') {
            throw new AppError('Unauthorized: You are not the owner of this trip', 401);
        }

        const deletedTrip = await Trip.findByIdAndDelete(tripId);
        return deletedTrip;
    } catch (error) {
        throw error;
    }
}