import mongoose from 'mongoose';
import dotenv from 'dotenv';


// Loads the .env file into process.env
dotenv.config();

export async function connect(){
/**
 * Connect to MongoDB Atlas using MONGO_URI from the
 * .env file. If successful, logs a message to the console.
 *
 * @param none
 * @returns {Promise} - a connection.
 */

    try{
        await mongoose.connect(process.env.MONGO_URI);
        const {connection} = mongoose;
        connection.on('connected', () => {
            console.log('Successfully connected to MongoDB using Mongoose!');
        });
        connection.on('error', (err) => {
            console.log('Connection error:', err);
            throw Error(`Could not connect to MongoDB ${err.message}`);
        });

    } catch(err){
        console.log('Initial connection failure:', err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}
