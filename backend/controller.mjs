import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { Exercise } from './model.mjs';

const router = express.Router();

// Validation helper function
const validateExerciseBody = (body) => {
    const requiredProps = ['name', 'reps', 'weight', 'unit', 'date'];
    const requestProps = Object.keys(body);
    
    // Check if request has exactly the required properties
    return requestProps.length === 5 && requiredProps.every(prop => requestProps.includes(prop));
};

// Error handling helper function
const handleMongooseErrors = (error, res) => {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ Error: "Invalid request" });
    }
    if (error.name === 'CastError') {
        return res.status(404).json({ Error: "Not found" });
    }
    throw error; // Rethrow other errors
};

// CREATE new Exercise
router.post('/exercises', asyncHandler(async (req, res) => {
    if (!validateExerciseBody(req.body)) {
        return res.status(400).json({ Error: "Invalid request" });
    }
    
    try {
        const exercise = new Exercise(req.body);
        const createdExercise = await exercise.save();
        res.status(201).json(createdExercise);
    } catch (error) {
        handleMongooseErrors(error, res);
    }
}));

// GET all or filtered Exercises
router.get('/exercises', asyncHandler(async (req, res) => {
    const filter = {};
    
    // Apply filters if provided in query parameters
    ['name', 'unit', 'date'].forEach(field => {
        if (req.query[field]) filter[field] = req.query[field];
    });
    
    // Handle numeric fields separately
    ['reps', 'weight'].forEach(field => {
        if (req.query[field]) filter[field] = Number(req.query[field]);
    });

    const foundExercises = await Exercise.find(filter);
    res.status(200).json(foundExercises);
}));

// GET Exercise by ID
router.get('/exercises/:id', asyncHandler(async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        
        if (!exercise) {
            return res.status(404).json({ Error: "Not found" });
        }
        
        res.status(200).json(exercise);
    } catch (error) {
        handleMongooseErrors(error, res);
    }
}));

// UPDATE Exercise by ID
router.put('/exercises/:id', asyncHandler(async (req, res) => {
    if (!validateExerciseBody(req.body)) {
        return res.status(400).json({ Error: "Invalid request" });
    }
    
    try {
        // Validate the input using mongoose validation
        const tempExercise = new Exercise(req.body);
        await tempExercise.validate();
        
        // If validation passes, update the document
        const updatedExercise = await Exercise.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedExercise) {
            return res.status(404).json({ Error: "Not found" });
        }

        res.status(200).json(updatedExercise);
    } catch (error) {
        handleMongooseErrors(error, res);
    }
}));

// DELETE Exercises by filter
router.delete('/exercises', asyncHandler(async (req, res) => {
    const filter = {};
    const { name, reps, weight, unit, date } = req.query;

    // Apply the first filter found
    if (name) filter.name = name;
    else if (reps) filter.reps = Number(reps);
    else if (weight) filter.weight = Number(weight);
    else if (unit) filter.unit = unit;
    else if (date) filter.date = date;
    else {
        return res.status(400).json({ Error: "Missing required query parameter." });
    }

    const result = await Exercise.deleteMany(filter);
    res.status(200).json({ deletedCount: result.deletedCount });
}));

// DELETE Exercise by ID
router.delete('/exercises/:id', asyncHandler(async (req, res) => {
    try {
        const result = await Exercise.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ Error: "Not found" });
        }

        res.status(204).send();
    } catch (error) {
        handleMongooseErrors(error, res);
    }
}));

export default router;

