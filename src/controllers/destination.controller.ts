import { Request, Response } from 'express';
import { DestinationInterface } from '../models/destination.model';
import { verifyToken } from '../utils/generateToken';
import { createDestinationService, deleteDestinationService, getDestinationsService, updateDestinationService } from '../services/destinaation.service';

export const getDestinations = async (req: Request, res: Response) => {
    try {
        const destinations = await getDestinationsService();
        res.status(200).json({
            success: true,
            destinations
        });
    } catch (error: any) {
        res.status(500).json({
            success:false,
            message: `Error in Get Destination ${error.message}`
        });
    }
};

export const createDestination = async (req: Request, res: Response) => {
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
        console.log(verify.role)
        if(verify.role == 'student' || verify.role == 'parent'){
        res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize'
                }
            })
            return;
        }
    try {
        const destinationData: DestinationInterface = req.body;
        const newDestination = await createDestinationService(destinationData);
        res.status(201).json({
            success: true,
            newDestination
        });
    } catch (error: any) {
        res.status(400).json({
            success:false,
            message: `Error in Create Destination ${error.message}`
        });
    }
};

export const updateDestination = async (req: Request, res: Response) => {
         const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)
        const { destinationId } = req.params;
        const updateData = req.body;
    
        if(!destinationId){
            res.status(400) //BAD_REQUEST
            .json({
                success: false,
                error: 'Please Add destination ID at Params'
            })
            return;
        }
    
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
        if(verify.role != 'admin'){
        res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize'
                }
            })
            return;
        }
    try {
        const updatedDestination = await updateDestinationService(destinationId, updateData);
        res.status(200).json({
            success: true,
            updatedDestination
        });
    } catch (error: any) {

            res.status(400)
            .json({
                success:false,
                message: `Error in Update Destination ${error.message}`
                 });
    }
};

// حذف الوجهة
export const deleteDestination = async (req: Request, res: Response) => {
     const token = req.headers.authorization
        const verify = verifyToken(token?.split(' ')[1] as string)
        const { destinationId } = req.params;
    
        if(!destinationId){
            res.status(400) //BAD_REQUEST
            .json({
                success: false,
                error: 'Please Add destination ID at Params'
            })
            return;
        }
    
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
        if(verify.role != 'admin'){
        res.status(401) // UNAUTHORAIZE
            .json({
                success:false,
                error:{
                    message: 'Unauthorize'
                }
            })
            return;
        }
    try {

        const deletedDestination = await deleteDestinationService(destinationId);
        res.status(200).json({
            success: true,
            message: 'Destination Deleted Successfully'
        });
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            message: `Error in Delete Destination ${error.message}`
        });
    }
};