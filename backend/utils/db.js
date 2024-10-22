import dotenv from 'dotenv';

import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => { 
    try {
        await mongoose.connect(process.env.DBURI).then(() => {
            console.log('Database connected');
        });
    } catch (error) {
        console.log('Error: ', error.message);
    }
}

export default connectDB;