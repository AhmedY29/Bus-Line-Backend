import mongoose, { Schema } from "mongoose";

export interface DestinationInterface {

  title: string,
  latitude: number,
  longitude: number,

}

const DestinationSchema = new Schema({
    title: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

},{
    timestamps:true
})


export const Destination =  mongoose.model<DestinationInterface>('Destination', DestinationSchema);