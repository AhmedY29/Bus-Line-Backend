import { Request, Response } from "express";
import {
  createRatingService,
  getDriverRatingsService,
  getRatingService,
  updateRatingService,
  deleteRatingService,
} from "../services/rating.service";
import { verifyToken } from "../utils/generateToken";

export const createRating = async (req: Request, res: Response) => {
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
    const rating = await createRatingService(req.body);
    res.status(201).json({
        success: true,
        rating
    });
    } catch (error: any) {
        res.status(400)
        .json({
            success: false,
            message:`Error In Create Rating: ${error.message}`
        })
    }
};

export const getDriverRatings = async (req: Request, res: Response) => {

    
  const { driverId } = req.params;

  if(!driverId){
     res.status(400)
    .json({
        success: false,
        message:`Error: Driver ID Invalid`
    })
    return;
  }
  try {
    const ratings = await getDriverRatingsService(driverId);
    res.status(200).json({
        success: true,
        ratings
    });
  } catch (error: any) {
    res.status(400)
    .json({
        success: false,
        message:`Error In Get Driver Ratings: ${error.message}`
    })
  }
};

export const getRating = async (req: Request, res: Response) => {
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
        const { rateId } = req.params;
        const rating = await getRatingService(rateId);
        if (!rating) {
             res.status(404).json({ message: "Rating not found" });
             return
        }
        res.status(200).json({
            success: true,
            rating
        });
    } catch (error: any) {
    res.status(400)
    .json({
        success: false,
        message:`Error In Get Rating: ${error.message}`
    })
  }
};

export const updateRating = async (req: Request, res: Response) => {
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
        const { rateId } = req.params;
        const rating = await updateRatingService(rateId, req.body);
        if (!rating) {
            res.status(404).json({ message: "Rating not found" });
            return
        }

        res.status(200).json({
            success: true,
            rating
        });
    } catch (error: any) {
        res.status(400)
        .json({
            success: false,
            message:`Error In Update Rating: ${error.message}`
        })
    }
};

export const deleteRating = async (req: Request, res: Response) => {
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
        const { rateId } = req.params;
        const rating = await deleteRatingService(rateId);
        if (!rating) {
             res.status(404).json({ message: "Rating not found" });
             return
        }

        res.status(200).json({ success:true, message: "Rating deleted" });
    } catch (error: any) {
        res.status(400)
        .json({
            success: false,
            message:`Error In Delete Rating: ${error.message}`
        })
    }
};
