import { Request, Response } from "express";
import { verifyToken } from "../utils/generateToken";
import { deleteOneNotification, getUserNotifications, markAllAsRead, markAsRead } from "../services/notification.service";

export const getMyNotifications = async (req: Request, res: Response) => {
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
    const notifications = await getUserNotifications(verify.userId);
    res.status(200).json({
        success: true,
        notifications
    });
  } catch (error: any) {
    res.status(400).json({
        success: false,
        message:`Error In Getting Notifications: ${error.message}`
    });
  }
};

export const markOneRead = async (req: Request, res: Response) => {
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
                const { id } = req.params;
                await markAsRead(id);
                res.status(200).json({ success: true });
            } catch (error: any) {
    res.status(400).json({
        success: false,
        message:`Error In Read Notification: ${error.message}`
    });
  }
};

export const markAllRead = async (req: Request, res: Response) => {
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
    await markAllAsRead(verify.userId);
    res.status(200).json({ success: true });
  } catch (error: any) {
      res.status(400).json({
          success: false,
        message:`Error In Read All Notifications: ${error.message}`
    });
  }
};
    export const deleteNotification = async (req: Request, res: Response) => {
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
        const { id } = req.params;
        await deleteOneNotification(id);
        res.status(200).json({ success: true });
      } catch (error: any) {
        res.status(400).json({
            success: false,
            message:`Error In Delete Notification: ${error.message}`
        });
      }
    };
