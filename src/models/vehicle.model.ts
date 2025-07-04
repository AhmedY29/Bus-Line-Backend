import mongoose, { Schema } from "mongoose";

export interface VehicleInterface {
  name:string,
  color:string,
  model:string
  plateNumber:string
  capacity:number,
  driverId:mongoose.Types.ObjectId,
  yearlyCheck:boolean
}

const vehicleSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
    driverId: { type: mongoose.Types.ObjectId, ref:'Driver'},
    yearlyCheck: { type: Boolean, required: true },

},{
    timestamps:true
})


export const Vehicle =  mongoose.model<VehicleInterface>('Vehicle', vehicleSchema);