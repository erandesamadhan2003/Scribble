import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)        
        console.log(`MongoDB database connected`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); 
    }
}