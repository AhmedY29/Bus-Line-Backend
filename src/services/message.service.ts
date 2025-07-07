import { Message } from '../models/message.model';
import { User, UserInterface } from '../models/user.model';
import { Trip, TripInterface } from '../models/trip.model';
import { Booking } from '../models/booking.model';
import mongoose from 'mongoose';
import { AppError } from '../utils/error';
import { Driver, DriverInterface } from '../models/driver.model';

type AllowedConversation = 
  'driver-student' | 
  'student-driver' | 
  'driver-admin' | 
  'admin-driver' | 
  'admin-student';

export const sendMessageService = async ({
  senderId,
  receiverId,
  tripId,
  content
}: {
  senderId: string;
  receiverId: string;
  tripId?: string;
  content: string;
}) => {
  let sender = await User.findById(senderId);
  if (!sender) sender = await Driver.findById(senderId);

  let receiver = await User.findById(receiverId);
  if (!receiver) receiver = await Driver.findById(receiverId);

  if (!sender || !receiver) {
    throw new AppError('User or Driver not found', 404);
  }

  const conversationType = await getConversationType(
    { _id: senderId, role: sender.role },
    { _id: receiverId, role: receiver.role },
    tripId
  );

  if (!conversationType) {
    throw new AppError('Unauthorized communication', 403);
  }

  if (tripId && !(await Trip.exists({ _id: tripId }))) {
    throw new AppError('Trip not found', 404);
  }

  const senderModel = (<any>sender).constructor.modelName;
  const receiverModel = (<any>receiver).constructor.modelName;

  const message = await Message.create({
    sender: senderId,
    senderModel,
    receiver: receiverId,
    receiverModel,
    tripId,
    content,
    messageType: conversationType,
    read: false
  });

  const populated = await Message.findById(message._id)
    .populate('sender')
    .populate('receiver');

  return populated;
};


export const getUserConversationsService = async (userId: string, userRole: string) => {
  const query = userRole === 'admin' 
    ? {} 
    : {
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      };

  return Message.find(query)
    .populate('sender', '-password')
    .populate('receiver', '-password')
    .populate('tripId',)
    .sort({ createdAt: -1 });
};

export const getConversationService = async (
  userId: string,
  otherUserId: string,
  tripId?: string
) => {
  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId }
    ],
    ...(tripId && { tripId })
  })
  .sort({ createdAt: 1 })
    .populate('sender', '-password')
    .populate('receiver', '-password')
    .populate('tripId',)

  return messages;
};

const getConversationType = async (
  sender: { _id: string; role: string },
  receiver: { _id: string; role: string },
  tripId?: string
): Promise<AllowedConversation | null> => {
  const senderRole = sender.role;
  const receiverRole = receiver.role;

  if (senderRole === 'admin') {
    return receiverRole === 'driver' ? 'admin-driver' : 'admin-student';
  }

  if (senderRole === 'driver' && receiverRole === 'admin') {
    return 'driver-admin';
  }


  if (
    (senderRole === 'driver' && receiverRole === 'student') ||
    (senderRole === 'student' && receiverRole === 'driver')
  ) {
    if (!tripId) return null;

    const isValid = await Booking.exists({
      tripId,
      userId: senderRole === 'driver' ? receiver._id : sender._id,
    //   status: 'confirmed'
    });

    return isValid ? 
      (senderRole === 'driver' ? 'driver-student' : 'student-driver') 
      : null;
  }

  return null;
};


export const markAsReadService = async (messageId: string, userId: string) => {
  await Message.updateOne(
    { _id: messageId, receiver: userId },
    { $set: { read: true } }
  );
};

export const getAdminContacts = async () => {
  const users = await User.find({}).select('name role');
  const drivers = await Driver.find({}).select('name role');
  return [...users, ...drivers].map(user => ({
    id: user._id.toString(),
    name: user.name,
    role: user.role,
  }));
}


export const getDriverContacts = async (driverId: string) => {
  const trips = await Booking.find()
    .populate<{ userId: UserInterface }>('userId', 'name role')
    .populate<{ tripId: TripInterface }>('tripId', 'driverId')
    .lean();

  const filteredTrips = trips.filter(
    (trip) =>
      trip.tripId &&
      trip.tripId.driverId?.toString() === driverId
  );

  const contactsWithMessages = await Promise.all(
    filteredTrips.map(async (trip) => {
      const messages = await Message.find({
        tripId: trip.tripId._id,
        $or: [
          { sender: new mongoose.Types.ObjectId(driverId) },
          { receiver: new mongoose.Types.ObjectId(driverId) },
        ],
      })
        .sort({ createdAt: 1 })
        .lean();

      return {
        id: trip.userId._id.toString(),
        tripId: trip.tripId._id.toString(),
        receiverId: trip.userId._id,
        senderId: driverId,
        name: trip.userId.name,
        role: trip.userId.role,
        messages: messages.map((msg) => ({
          id: msg._id.toString(),
          senderId: msg.sender.toString(),
          receiverId: msg.receiver.toString(),
          content: msg.content,
          createdAt: msg.createdAt,
        })),
      };
    })
  );

  return contactsWithMessages;
};




export const getPassengerContacts = async (passengerId: string) => {
  try {
    const trips = await Booking.find({
      userId: new mongoose.Types.ObjectId(passengerId),
    })
      .populate<{ tripId: { driverId: DriverInterface; _id: string } }>({
        path: 'tripId',
        populate: {
          path: 'driverId',
          select: '_id name role',
        },
      })
      .lean();

    const contactsWithMessages = await Promise.all(
      trips
        .filter((trip) => trip.tripId && trip.tripId.driverId)
        .map(async (trip) => {
          const messages = await Message.find({
            tripId: trip.tripId._id,
            $or: [
              { sender: new mongoose.Types.ObjectId(passengerId) },
              { receiver: new mongoose.Types.ObjectId(passengerId) },
            ],
          })
            .sort({ createdAt: 1 })
            .lean();

          return {
            id: trip.tripId.driverId._id.toString(),
            tripId: trip.tripId._id.toString(),
            receiverId: trip.tripId.driverId._id,
            senderId: passengerId,
            name: trip.tripId.driverId.name,
            role: trip.tripId.driverId.role,
            messages: messages.map((msg) => ({
              id: msg._id.toString(),
              senderId: msg.sender.toString(),
              receiverId: msg.receiver.toString(),
              content: msg.content,
              createdAt: msg.createdAt,
            })),
          };
        })
    );

    return contactsWithMessages;
  } catch (error) {
    console.error('Error in getPassengerContacts:', error);
    throw new Error('Failed to fetch passenger contacts');
  }
};

// export const deleteMessage = async (messageId: string, userId: string, userRole: string) => {
//   const query = userRole === 'admin' 
//     ? { _id: messageId } 
//     : { _id: messageId, sender: userId };

//   const deleted = await Message.findOneAndDelete(query);
//   if (!deleted) {
//     throw new AppError('Message not found or unauthorized', 404);
//   }
// };