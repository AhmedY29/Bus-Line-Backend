import mongoose, { Schema } from "mongoose";

export interface UserInterface {
  _id:mongoose.Types.ObjectId,
  name:string,
  email: string;
  password: string;
  role: 'student' |'parent' | 'admin';
  _doc:any
  address: object,
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: String,
    role: {
        type: String,
        enum: ["student", "parent", "admin"],
        required: true
  },
  address:{
    addressName:{type: String},
    coordinate:{
      lat:{type: Number},
      lng:{type: Number}
    }
  }
},{
    timestamps:true
})


export const User =  mongoose.model<UserInterface>('User', userSchema);