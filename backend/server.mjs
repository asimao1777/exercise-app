import express from 'express';                                   // Imports Express framework to create the server
import dotenv from 'dotenv';                                      // Imports dotenv to load environment variables from a .env file into process.env
import { connect } from '../database.mjs';                      // Imports the database connection function
import exerciseRoutes from '../controller.mjs';                  // Imports the application routes


dotenv.config();                                                    // Loads environment variables from .env file so they are accessible in process.env

const app = express();                                            // Initializes the Express application
app.use(express.json());                                         // Enables reading of data from the request body, parses JSON in every route that uses it (that's why it is in 'server.mjs' file).

// Mount the routes - do this outside initServer so routes are available even if server isn't started
app.use('/api', exerciseRoutes);                                // Mount the routes under /api/exercises endpoint

// Initialize the database and optionally start the server
const initServer = async (startServer = true) => {
  try {
    await connect();                                            // Establish connection to MongoDB Atlas
    
    if (startServer) {
      const PORT = process.env.PORT || 3000;                    // Defines the port, using the value from .env or defaulting to 3000
      
      app.listen(PORT, () => {
        console.log(`\U0001F680 Server running on port ${PORT}...`);  // Start the Express server and listen on the defined port
      });
    }
    return app;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    if (startServer) {
      process.exit(1);                                          // Exit the process if database connection fails and we're starting the server
    }
    throw error;  // Re-throw the error for handling in test environments
  }
};

// Only start the server if this is not a test environment
// This makes the code more compatible with Jest and other testing frameworks
if (process.env.NODE_ENV !== 'test') {
  initServer();
}

// Export the app and initServer function for testing
export { app, initServer };
