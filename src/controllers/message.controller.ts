import { Request, Response } from 'express';
import { 
  getUserConversationsService,
  getConversationService,
  sendMessageService,
  markAsReadService,
  getPassengerContacts,
  getDriverContacts,
  getAdminContacts,
} from '../services/message.service';
import { verifyToken } from '../utils/generateToken';

export const getConversations = async (req: Request, res: Response) => {
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
  const conversations = await getUserConversationsService(verify.userId, verify.role);
  res.status(200).json(conversations);
};

export const getAvailableContacts = async (req: Request, res: Response) => {
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
    let contacts = [];

    console.log(verify.role)
    switch (verify.role) {
      case 'admin':
        contacts = await getAdminContacts();
        break;
      case 'driver':
        contacts = await getDriverContacts(verify.userId);
        break;
      case 'student':
        contacts = await getPassengerContacts(verify.userId);
        break;
      case 'parent':
        contacts = await getPassengerContacts(verify.userId);
        break;
      default:
         res.status(403).json({
          success: false,
          message: 'Unauthorized access',
        });
        return
    }

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error: any) {
    console.error('Error in getAvailableContacts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts',
    });
  }
};

export const getConversation = async (req: Request, res: Response) => {
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
  const conversation = await getConversationService(
    verify.userId,
    req.params.userId,
    req.params.tripId,
  );
  res.status(200).json({
    success: true,
    messages: conversation
  });
};

export const sendMessage = async (req: Request, res: Response) => {
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
  const message = await sendMessageService({
    senderId: verify.userId,
    senderRole: verify.role,
    ...req.body
  });
  res.status(201).json(message);
};

export const markAsRead = async (req: Request, res: Response) => {
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
  await markAsReadService(req.params.messageId, verify.userId);
  res.status(204).send();
};

// export const deleteMessage = async (req: Request, res: Response) => {
//   await deleteMessageService(req.params.messageId, req.user);
//   res.status(204).send();
// };