import { AppError } from '../utils/error';
import { Destination, DestinationInterface } from '../models/destination.model';
import mongoose from 'mongoose';

export const getDestinationsService = async () => {
    try {
        return await Destination.find();
    } catch (error:any) {
        throw error.message;
    }
};

export const createDestinationService = async (destinationData: DestinationInterface) => {
    try {
        const newDestination = new Destination(destinationData);
        await newDestination.save();
        return newDestination;
    } catch (error:any) {
        throw error.message;
    }
};

export const updateDestinationService = async (destinationId: string, updateData: Partial<DestinationInterface>) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(destinationId)) {
            throw new AppError('Invalid destination ID', 400);
        }
        
        const updatedDestination = await Destination.findByIdAndUpdate(
            destinationId,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedDestination) {
            throw new AppError('Destination not found', 404);
        }
        return updatedDestination;
    } catch (error:any) {
        throw error.message;
    }
};

export const deleteDestinationService = async (destinationId: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(destinationId)) {
            throw new AppError('Invalid destination ID', 400);
        }
        
        const deletedDestination = await Destination.findByIdAndDelete(destinationId);
        if (!deletedDestination) {
            throw new AppError('Destination not found', 404);
        }
        return deletedDestination;
    } catch (error:any) {
        throw error.message;
    }
};