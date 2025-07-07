import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_INARY_NAME, 
        api_key: process.env.CLOUD_INARY_API, 
        api_secret: process.env.CLOUD_INARY_API_SECRET
    });

    export default cloudinary;