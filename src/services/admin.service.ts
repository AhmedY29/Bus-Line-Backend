import { User } from "../models/user.model";
import { Driver } from "../models/driver.model";
import { Vehicle } from "../models/vehicle.model";



 export const getAllUsers = async()=> {
    return await User.find().select('-password');
  }

export const getUserById = async (userId: string) => {
    return await User.findById(userId).select('-password');
  }

  export const updateUser = async (userId: string, updateData: any) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  export const deleteUser = async (userId: string) => {
    return await User.findByIdAndDelete(userId);
  }


  export const getAllDrivers = async () => {
    return await Driver.find().select('-password').populate('vehicleId');
  }

  export const getDriverById = async (driverId: string) => {
    return await Driver.findById(driverId).select('-password').populate('vehicleId');
  }

  export const updateDriver = async (driverId: string, updateData: any) => {
    return await Driver.findByIdAndUpdate(driverId, updateData, { new: true });
  }

  export const deleteDriver = async (driverId: string) => {
    const driver = await Driver.findByIdAndDelete(driverId);
    if (driver) {
      await Vehicle.deleteOne({ driverId });
    }
    return driver;
  }

  export const updateDriverStatus = async (driverId: string, status: 'approved' | 'rejected') => {
    return await Driver.findByIdAndUpdate(driverId, { status }, { new: true });
  }


  export const getAllVehicles = async () => {
    return await Vehicle.find().populate('driverId');
  }

  export const getVehicleById = async (vehicleId: string) => {
    return await Vehicle.findById(vehicleId).populate('driverId');
  }

  export const updateVehicle = async (vehicleId: string, updateData: any) => {
    return await Vehicle.findByIdAndUpdate(vehicleId, updateData, { new: true });
  }

  export const deleteVehicle = async (vehicleId: string) => {
    return await Vehicle.findByIdAndDelete(vehicleId);
  }