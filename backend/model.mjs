import mongoose from 'mongoose';

export function createModel() {
  // Check if model already exists to prevent overwriting in tests
  if (mongoose.models.Exercise) {
    return mongoose.models.Exercise;
  }

  const userSchema = new mongoose.Schema({
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

  return mongoose.model('Exercise', userSchema);
}

export const Exercise = createModel();

