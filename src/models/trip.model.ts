import mongoose, { Schema } from "mongoose";

export interface TripInterface {

  tripDateStart: Date,
  tripDateEnd: Date,
  driverId:mongoose.Types.ObjectId,
  neighborhood:String,
  destinationId:mongoose.Types.ObjectId,
  tripPrice:string,
  status:string,
  arrivalTime: string,
  departureTime: string,

}

const tripSchema = new Schema({
    driverId: { type: mongoose.Types.ObjectId, ref:'Driver', required: true },
    destinationId: { type: mongoose.Types.ObjectId, ref:'Destination', required: true },
    tripDateStart: { type: Date, required: true },
    tripDateEnd: { type: Date, required: true },
    neighborhood: { type: String, required: true },
    status: { type: String, required: true },
    tripPrice: { type: Number, required: true },
    arrivalTime: { type: String, required: true },
    departureTime: { type: String, required: true },

},{
    timestamps:true
})


export const Trip =  mongoose.model<TripInterface>('Trip', tripSchema);