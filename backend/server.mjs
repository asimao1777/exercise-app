import express from 'express';                                   // Imports Express framework to create the server
import dotenv from 'dotenv';                                      // Imports dotenv to load environment variables from a .env file into process.env
import { connect } from './database.mjs';                      // Imports the database connection function
import exerciseRoutes from './controller.mjs';                  // Imports the application routes


dotenv.config();                                                    // Loads environment variables from .env file so they are accessible in process.env

const app = express();                                            // Initializes the Express application
app.use(express.json());                                         // Enables reading of data from the request body, parses JSON in every route that uses it (that's why it is in 'server.mjs' file).

await connect();                                                   // Establish connection to MongoDB Atlas and ensures the connection is successful before handling requests

app.use('/api', exerciseRoutes);                                // Mount the routes under /api/exercises endpoint

const PORT = process.env.PORT || 3000;                       // Defines the port, using the value from .env or defaulting to 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}...`);      // Start the Express server and listen on the defined port
});
