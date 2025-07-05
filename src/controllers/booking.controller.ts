import { Request, Response } from 'express';
import { BookingInterface } from '../models/booking.model';
import { cancelBookingService, createBookingService, deleteBookingService, getBookByTripService, getBookingRelatedUserService, getBookingsByDriverIdService, getBookingsByStudentIdService, getBookingService, getBookingsPendingByDriverIdService, getBookingsService, getPassengersByDriverIdService, updateBookingService } from '../services/booking.service';
import { verifyToken } from '../utils/generateToken';

export const createBooking = async (req: Request, res: Response) => {
        const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)

            if(!verify){
            res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize: You have To Sign In'
                }
            })
            return;
        }

  try {
    const bookingData: BookingInterface = {
      ...req.body,
      userId: verify.userId,
      status: 'pending'
    };
    const booking = await createBookingService(bookingData);
    res.status(201).json({
        success: true,
        message:'Booked Successfully',
        booking
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error In Create Booking: ${error.message} `
    });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await getBookingsService();
    res.status(200).json({
        success: true,
        bookings
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error In Get Bookings: ${error.message }`
    });
  }
};

export const getPassengersByDriverId = async (req: Request, res: Response) => {
        const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)

            if(!verify){
            res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize: You have To Sign In'
                }
            })
            return;
        }
        if(verify.role == 'student'){
            res.status(400)
            .json({
                success: false,
                message:`Unauthorize`
            })
            return
        }
  try {
    const passengers = await getPassengersByDriverIdService(verify.userId);
    res.status(200).json({
        success: true,
        passengers
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error In Get Booking Passengers: ${error.message }`
    });
  }
};

export const getBookingsByDriverId = async (req: Request, res: Response) => {
        const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)

            if(!verify){
            res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize: You have To Sign In'
                }
            })
            return;
        }
        if(verify.role == 'student'){
            res.status(400)
            .json({
                success: false,
                message:`Unauthorize`
            })
            return
        }
  try {
    const bookings = await getBookingsByDriverIdService(verify.userId);
    res.status(200).json({
        success: true,
        bookings
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error In Get Bookings: ${error.message }`
    });
  }
};

export const getBookingsPendingByDriverId = async (req: Request, res: Response) => {
        const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)

            if(!verify){
            res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize: You have To Sign In'
                }
            })
            return;
        }
        if(verify.role == 'student'){
            res.status(400)
            .json({
                success: false,
                message:`Unauthorize`
            })
            return
        }
  try {
    const bookings = await getBookingsPendingByDriverIdService(verify.userId);
    res.status(200).json({
        success: true,
        bookings
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error In Get Bookings: ${error.message }`
    });
  }
};

export const getBookingsByStudentId = async (req: Request, res: Response) => {
        const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)

            if(!verify){
            res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize: You have To Sign In'
                }
            })
            return;
        }
        if(verify.role == 'driver'){
            res.status(400)
            .json({
                success: false,
                message:`Unauthorize`
            })
            return
        }
  try {
    const bookings = await getBookingsByStudentIdService(verify.userId);
    res.status(200).json({
        success: true,
        bookings
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error In Get Bookings: ${error.message }`
    });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const booking = await getBookingService(req.params.bookingId);
    if (!booking) {
        res.status(404).json({ success:false, message: 'Booking not found' });
        return    
    }
    res.status(200).json({
        success: true,
        booking
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error in Get Booking: ${error.message }`
    });
  }
};

export const getBookingRelatedUser = async (req: Request, res: Response) => {
        const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)

            if(!verify){
            res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize: You have To Sign In'
                }
            })
            return;
        }
  try {
    if (verify.role !== 'admin' && req.params.userId !== verify.userId.toString()) {
       res.status(403).json({ message: 'Unauthorized' });
       return
    }
    
    const bookings = await getBookingRelatedUserService(req.params.userId);
    res.status(200).json({
        success: true,
        bookings
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error In Get Booking Related User: ${error.message }`
    });
  }
};

export const getBookByTrip = async (req: Request, res: Response) => {
        const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)

            if(!verify){
            res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize: You have To Sign In'
                }
            })
            return;
        }
        
        if(verify.role == 'student' || verify.role == 'parent'){
            res.status(403)
            .json({
                success: false,
                message: 'Unauthorize'
            })
            return
        }
  try {
    const bookings = await getBookByTripService(req.params.tripId);
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error in Get Booking By TripId: ${error.message}`
    });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)

    if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }
  try {
    const booking = await updateBookingService(
      req.params.bookingId, 
      req.body
    );
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error in Update Booking: ${error.message}`
    });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)

    if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }
  try {
    const booking = await cancelBookingService(
      req.params.bookingId,
      req.body.cancellationReason
    );
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error in Cancel Booking: ${error.message}`
    });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)

    if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'Unauthorize: You have To Sign In'
            }
        })
        return;
    }
  try {
    await deleteBookingService(req.params.bookingId);
    res.status(200).json({
        success: true,
        message: 'Deleted Booking Successfully'
    })
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message: `Error in Delete Booking: ${error.message}`
    });
  }
};