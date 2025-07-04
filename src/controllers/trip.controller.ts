import { Request, Response } from "express";
import { verifyToken } from "../utils/generateToken";
import { createTripService, deleteTripService, getTripService, getTripsService, updateTripService } from "../services/trip.service";



    // Create a new trip
    export const createTrip =  async (req: Request, res: Response) => {
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
            const tripData = req.body;
            const newTrip = await createTripService(tripData);
            res.status(201).json(newTrip);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all trips
    export const getTrips = async (req: Request, res: Response) => {
        try {
            const trips = await getTripsService();
            res.status(200).json({
                success: true,
                trips
            });
        } catch (error: any) {
            res.status(400).json({
                success:false,
                message: `Error In Get Trips: ${error.message}`
            });
        }
    }

    // Get a single trip by ID
    export const getOneTrip = async (req: Request, res: Response) => {
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
            res.status(403)
            .json({
                success: false,
                error:{
                    message: 'Unauthorize'
                }
            })
        }
        try {
            const tripId = req.params.tripId;
            const trip = await getTripService(tripId);
            res.status(200).json(trip);
        } catch (error: any) {
            if (error.message === 'Trip not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({
                success:false,
                message: `Error In Get Trip: ${error.message}`
            });
            }
        }
    }

    // Update a trip
    export const updateTrip = async (req: Request, res: Response) => {
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
            const tripId = req.params.tripId;
            const updateData = req.body;
            const updatedTrip = await updateTripService(tripId, verify.userId, verify.role, updateData);
            res.status(200).json(updatedTrip);
        } catch (error: any) {
                res.status(400).json({
                success:false,
                message: `Error In Get Trips: ${error.message}`
            });
        }
    }

    // Delete a trip
    export const deleteTrip = async (req: Request, res: Response) => {
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
            const tripId = req.params.tripId;
            const deletedTrip = await deleteTripService(tripId,verify.role, verify.userId);
            res.status(200).json(deletedTrip);
        } catch (error: any) {
            if (error.message === 'Trip not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }

