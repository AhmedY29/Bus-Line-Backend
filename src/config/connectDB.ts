
import mongoose from "mongoose";
import dotenv from 'dotenv'
import logger from "../utils/logger";

dotenv.config()

export async function connectDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(process.env.MONGO_URI as string);
    if(mongoose.connection.db){
        await mongoose.connection.db.admin().command({ ping: 1 });
    }
    logger.info('Pinged your deployment. You successfully connected to MongoDB!');
} catch (error: any) {
    await mongoose.disconnect();
    logger.error(`Error in connect to MongoDB!: ${error.message}`);

  }
}
