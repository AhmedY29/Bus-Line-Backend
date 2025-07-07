import mongoose, { Schema } from "mongoose";

export interface MessageInterface {
  sender: mongoose.Types.ObjectId;
  senderModel:string,
  receiver: mongoose.Types.ObjectId;
  receiverModel:string,
  tripId?: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  messageType: string;
  createdAt: Date;
}

const MessageSchema = new Schema({
  sender: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    refPath: 'senderModel' 
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Driver']
  },
  receiver: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    refPath: 'receiverModel' 
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'Driver']
  },
  tripId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Trip' 
  },
  content: { 
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  messageType: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Message = mongoose.model<MessageInterface>('Message', MessageSchema);