import moongose from 'mongoose';

export function createModel(){
/**
 * Creates a Mongo DB Schema and Model for
 * exercises. The Moongose model 'Exercise'
 * will use the 'exercises' collection in MongoDB.
 * Mongoose automatically lowercases and pluralizes
 * the model name.
 *
 * @params none
 * @returns MongoDB model
 */

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true },

    reps: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) { return value > 0 && Number.isInteger(value); },      // Checks whether 'reps' is greater than 0.
        message: props => `The number ${props.value} is not a valid number of reps.`
      },
    },

    weight: {
      type: Number,
      required: true,
      validate: {
      validator: function(value) { return value > 0 && Number.isInteger(value); },       // Checks whether 'weight' is greater than 0.
      message: props => `The number ${props.value} is not a valid weight.`
      },
    },

    unit: {
      type: String,
      required: true,
      validate: {
      validator: function(unit){return unit === 'kgs' || unit === 'lbs';},                 // Checks whether 'unit' is either 'kgs' or 'lbs'.},
      message: props => `${props.value} is not a valid unit.`},
    },

    date: {
      type: String,
      required: true,
      validate: {validator: function(date){
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        return dateRegex.test(date);},                                                        // Checks whether 'date' is in the format 'MM-DD-YYYY'.
      message: props => `${props.value} is not a valid date format.`},
    },
  });

return mongoose.model('Exercise', userSchema)                                            // 'Exercise' model created from the schema.
}

const Exercise = createModel();                                                               // Model is stored into the 'Exercise' variable. It becomes the Moongose Model for the 'exercises' collection.

// /** CRUD Operations */

// // Create a new User
// const createUser = async (name, age, email, phoneNumber) => {
//   const user = new User({ name: name, age: age, email: email, phoneNumber: phoneNumber });
//   return user.save();
// }

// // Retrieve
// const findUsers = async (filter) => {
//   const query = User.find(filter);
//   return query.exec();
// }

// // Update
// const updateUser = async (id, updates) => {
//     const result = await User.updateOne({_id: id}, {$set: updates});
//     if (result.modifiedCount === 0) {
//         return null;
//     }

//     return updates;                                                                      // Returns only updated fields
// };

// // Delete
// const deleteUser = async (filter) => {
//     const result = await User.deleteMany(filter);
//     return result.deletedCount;
// }

// export { connect, createUser, findUsers, updateUser, deleteUser };


