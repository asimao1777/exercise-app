import supertest from 'supertest';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from '../server.mjs';
import { expect, test, describe, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';

// Load environment variables
dotenv.config();

const request = supertest(app);
let mongoServer;

// Helper function to ensure MongoDB connection is ready
const ensureDbConnection = async () => {
  // Set a timeout for connection establishment
  const timeout = 10000; // 10 seconds
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (mongoose.connection.readyState === 1) {
      return true; // Connected
    }
    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Database connection timeout');
};

// Connect to the test database
beforeAll(async () => {
  jest.setTimeout(30000); // Increase timeout for slower environments
  
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_CONNECT_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000 // Timeout for server selection
      });
      
      // Wait for connection to be fully established
      await ensureDbConnection();
      console.log('Successfully connected to MongoDB');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    // Fail all tests if database connection fails
    throw new Error(`Database connection failed: ${error.message}`);
  }
});

// Disconnect from the test database after all tests
afterAll(async () => {
  try {
    // Check if connection exists before attempting to drop and close
    if (mongoose.connection.readyState !== 0) {
      // Only try to drop if connected
      if (mongoose.connection.readyState === 1) {
        try {
          await mongoose.connection.dropCollection('exercises');
        } catch (err) {
          // Collection might not exist, which is fine
          if (err.code !== 26) {
            console.error('Error dropping collection:', err);
          }
        }
      }
      await mongoose.connection.close();
      console.log('Successfully disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error; // Re-throw to make test failure obvious
  }
});

// Clear the collection before each test
beforeEach(async () => {
  try {
    // Ensure we're connected before attempting operations
    await ensureDbConnection();
    
    // Now safe to delete documents
    await mongoose.connection.collection('exercises').deleteMany({});
    console.log('Collection cleared successfully');
  } catch (error) {
    console.error('Error clearing the collection:', error);
    throw error; // Re-throw to make test failure obvious
  }
});

// Verify after each test that we can still connect to the database
afterEach(async () => {
  try {
    // Confirm the connection is still active
    await ensureDbConnection();
  } catch (error) {
    console.error('Database connection lost during test:', error);
    throw error;
  }
});

// Valid exercise for testing
const validExercise = {
  name: 'Bench Press',
  reps: 10,
  weight: 135,
  unit: 'lbs',
  date: '01-25-24'
};

describe('1. POST /exercises endpoint', () => {
  test('should successfully create a new exercise with valid data', async () => {
    const response = await request
      .post('/api/exercises')
      .send(validExercise);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(validExercise.name);
    expect(response.body.reps).toBe(validExercise.reps);
    expect(response.body.weight).toBe(validExercise.weight);
    expect(response.body.unit).toBe(validExercise.unit);
    expect(response.body.date).toBe(validExercise.date);
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  test('should reject exercise with missing name', async () => {
    const invalidExercise = { ...validExercise };
    delete invalidExercise.name;

    const response = await request
      .post('/api/exercises')
      .send(invalidExercise);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Invalid request/);
  });

  test('should reject exercise with empty name', async () => {
    const response = await request
      .post('/api/exercises')
      .send({ ...validExercise, name: '' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Invalid request/);
  });

  test('should reject exercise with reps <= 0', async () => {
    const response = await request
      .post('/api/exercises')
      .send({ ...validExercise, reps: 0 });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Invalid request/);
  });

  test('should reject exercise with weight <= 0', async () => {
    const response = await request
      .post('/api/exercises')
      .send({ ...validExercise, weight: 0 });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Invalid request/);
  });

  test('should reject exercise with invalid unit', async () => {
    const response = await request
      .post('/api/exercises')
      .send({ ...validExercise, unit: 'pounds' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Invalid request/);
  });

  test('should reject exercise with invalid date format', async () => {
    const response = await request
      .post('/api/exercises')
      .send({ ...validExercise, date: '2023-01-25' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Invalid request/);
  });

  test('should reject exercise with extra property', async () => {
    const response = await request
      .post('/api/exercises')
      .send({ ...validExercise, extraProp: 'not allowed' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Invalid request/);
  });
});

describe('2. GET /exercises endpoint', () => {
  test('should return empty array when no exercises exist', async () => {
    const response = await request.get('/api/exercises');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  test('should return all exercises when exercises exist', async () => {
    // Create a few exercises first
    await request.post('/api/exercises').send(validExercise);
    await request.post('/api/exercises').send({
      name: 'Squats',
      reps: 15,
      weight: 225,
      unit: 'lbs',
      date: '02-15-24'
    });

    // Get all exercises
    const response = await request.get('/api/exercises');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('_id');
    expect(response.body[1]).toHaveProperty('_id');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});

describe('3. GET /exercises/:_id endpoint', () => {
  test('should return exercise when valid ID is provided', async () => {
    // Create an exercise
    const createResponse = await request
      .post('/api/exercises')
      .send(validExercise);
    
    const exerciseId = createResponse.body._id;
    
    // Get the exercise by ID
    const getResponse = await request.get(`/api/exercises/${exerciseId}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('_id', exerciseId);
    expect(getResponse.body.name).toBe(validExercise.name);
    expect(getResponse.headers['content-type']).toMatch(/application\/json/);
  });

  test('should return 404 when non-existent ID is provided', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request.get(`/api/exercises/${nonExistentId}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('Error');
    expect(response.body.Error).toMatch(/Not found/);
  });

  test('should return 404 when invalid ID format is provided', async () => {
    const response = await request.get('/api/exercises/invalidid');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('Error');
  });
});

describe('4. PUT /exercises/:_id endpoint', () => {
  test('should update exercise when valid ID and data are provided', async () => {
    // Create an exercise
    const createResponse = await request
      .post('/api/exercises')
      .send(validExercise);
    
    const exerciseId = createResponse.body._id;
    
    // Update data
    const updatedData = {
      name: 'Updated Exercise',
      reps: 12,
      weight: 150,
      unit: 'kgs',
      date: '03-15-24'
    };
    
    // Update the exercise
    const updateResponse = await request
      .put(`/api/exercises/${exerciseId}`)
      .send(updatedData);
    
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('_id', exerciseId);
    expect(updateResponse.body.name).toBe(updatedData.name);
    expect(updateResponse.body.reps).toBe(updatedData.reps);
    expect(updateResponse.body.weight).toBe(updatedData.weight);
    expect(updateResponse.body.unit).toBe(updatedData.unit);
    expect(updateResponse.body.date).toBe(updatedData.date);
    expect(updateResponse.headers['content-type']).toMatch(/application\/json/);
  });

  test('should return 400 when updating with invalid data', async () => {
    // Create an exercise
    const createResponse = await request
      .post('/api/exercises')
      .send(validExercise);
    
    const exerciseId = createResponse.body._id;
    
    // Invalid update data (negative reps)
    const invalidData = {
      name: 'Updated Exercise',
      reps: -5,
      weight: 150,
      unit: 'kgs',
      date: '03-15-24'
    };
    
    // Attempt to update with invalid data
    const updateResponse = await request
      .put(`/api/exercises/${exerciseId}`)
      .send(invalidData);
    
    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body).toHaveProperty('Error');
    expect(updateResponse.body.Error).toMatch(/Invalid request/);
  });

  test('should return 404 when updating non-existent ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    
    const updateResponse = await request
      .put(`/api/exercises/${nonExistentId}`)
      .send(validExercise);
    
    expect(updateResponse.status).toBe(404);
    expect(updateResponse.body).toHaveProperty('Error');
    expect(updateResponse.body.Error).toMatch(/Not found/);
  });

  test('should return 400 before 404 when both invalid data and non-existent ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    
    // Invalid data (missing name)
    const invalidData = { 
      reps: 10,
      weight: 150,
      unit: 'kgs',
      date: '03-15-24'
    };
    
    const updateResponse = await request
      .put(`/api/exercises/${nonExistentId}`)
      .send(invalidData);
    
    // Per requirements, it should check request validity before checking if document exists
    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body).toHaveProperty('Error');
    expect(updateResponse.body.Error).toMatch(/Invalid request/);
  });
});

describe('5. DELETE /exercises/:_id endpoint', () => {
  test('should delete exercise when valid ID is provided', async () => {
    // Create an exercise
    const createResponse = await request
      .post('/api/exercises')
      .send(validExercise);
    
    const exerciseId = createResponse.body._id;
    
    // Delete the exercise
    const deleteResponse = await request.delete(`/api/exercises/${exerciseId}`);
    
    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.body).toEqual({});
    
    // Verify exercise was deleted
    const getResponse = await request.get(`/api/exercises/${exerciseId}`);
    expect(getResponse.status).toBe(404);
  });

  test('should return 404 when deleting non-existent ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const deleteResponse = await request.delete(`/api/exercises/${nonExistentId}`);
    
    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toHaveProperty('Error');
    expect(deleteResponse.body.Error).toMatch(/Not found/);
  });
});

