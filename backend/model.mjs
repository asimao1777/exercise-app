import mongoose from 'mongoose';

// Private function to get the Exercise model (not exported)
function getExerciseModel() {
  // Check if model already exists to prevent overwriting in tests
  if (mongoose.models.Exercise) {
    return mongoose.models.Exercise;
  }

  const exerciseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    reps: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) { return value > 0 && Number.isInteger(value); },
        message: props => `The number ${props.value} is not a valid number of reps.`
      }
    },
    weight: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) { return value > 0 && Number.isInteger(value); },
        message: props => `The number ${props.value} is not a valid weight.`
      }
    },
    unit: {
      type: String,
      required: true,
      validate: {
        validator: function(unit) { return unit === 'kgs' || unit === 'lbs'; },
        message: props => `${props.value} is not a valid unit.`
      }
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function(date) {
          const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
          return dateRegex.test(date);
        },
        message: props => `${props.value} is not a valid date format.`
      }
    }
  });

  return mongoose.model('Exercise', exerciseSchema);
}

// CRUD Operations

/**
 * Create a new exercise in the database
 * @param {Object} exerciseData - The exercise data to create
 * @returns {Promise<Object>} - The created exercise
 */
export async function createExercise(exerciseData) {
  const Exercise = getExerciseModel();
  const exercise = new Exercise(exerciseData);
  return await exercise.save();
}

/**
 * Find all exercises, optionally filtered by query parameters
 * @param {Object} filter - Query parameters to filter results
 * @returns {Promise<Array>} - Array of exercise documents
 */
export async function findExercises(filter = {}) {
  const Exercise = getExerciseModel();
  return await Exercise.find(filter).exec();
}

/**
 * Find an exercise by its ID
 * @param {string} id - The ID of the exercise to find
 * @returns {Promise<Object|null>} - The found exercise or null if not found
 */
export async function findExerciseById(id) {
  const Exercise = getExerciseModel();
  return await Exercise.findById(id).exec();
}

/**
 * Update an exercise by its ID
 * @param {string} id - The ID of the exercise to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object|null>} - The updated exercise or null if not found
 */
export async function updateExerciseById(id, updates) {
  const Exercise = getExerciseModel();
  return await Exercise.findByIdAndUpdate(
    id, 
    updates, 
    { new: true, runValidators: true }
  ).exec();
}

/**
 * Delete an exercise by its ID
 * @param {string} id - The ID of the exercise to delete
 * @returns {Promise<Object|null>} - The deleted exercise or null if not found
 */
export async function deleteExerciseById(id) {
  const Exercise = getExerciseModel();
  return await Exercise.findByIdAndDelete(id).exec();
}

/**
 * Delete exercises that match the filter criteria
 * @param {Object} filter - Filter criteria for documents to delete
 * @returns {Promise<Object>} - Information about the deletion result
 */
export async function deleteExercises(filter = {}) {
  const Exercise = getExerciseModel();
  return await Exercise.deleteMany(filter).exec();
}
