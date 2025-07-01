import mongoose, { Schema } from "mongoose";

export interface UserInterface {
  name:string,
  email: string;
  password: string;
  role: 'student' |'parent' | 'admin';
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
},{
    timestamps:true
})


export const User =  mongoose.model<UserInterface>('User', userSchema);