import mongoose, { Document, Schema } from 'mongoose';

export interface DriverInterface extends Document {
  name: string,
  email: string,
  role:string,
  phoneNumber: number,
  licenseNumber: string,
  licenseImage: string,
  vehicleId:mongoose.Types.ObjectId,
  bankAccount: {
    bankName: string,
    accountNumber: string,
    accountName?: string,
  },
  password:string,
  status: 'pending' | 'approved' | 'rejected',
  rating?: number,
  _doc: any
}

const driverSchema = new Schema(
  {
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    role:{
      type:String,
      default:'driver'
    },
    phoneNumber:{
        type:Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    licenseImage: { 
      type: String, 
      required: true 
    },
    vehicleId: { type: mongoose.Types.ObjectId, ref:'Vehicle', required: true },
    bankAccount: {
      bankName: { type: String, required: true},
      accountNumber: { 
        type: String, 
        required: true,
        unique: true
      },
      accountName: String
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);



export const Driver = mongoose.model<DriverInterface>('Driver', driverSchema);