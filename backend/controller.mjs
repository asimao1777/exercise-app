import express from 'express';
import asyncHandler from 'express-async-handler';
import { createExercise, findExercises, findExerciseById,
         updateExerciseById, deleteExerciseById, deleteExercises } from './model.mjs';

const router = express.Router();

// Validation helper function
const validateExerciseBody = (body) => {
    const requiredProps = ['name', 'reps', 'weight', 'unit', 'date'];
    const requestProps = Object.keys(body);

    // Checks if request has exactly the required properties
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

// CRUD

// CREATE new Exercise
router.post('/exercises', asyncHandler(async (req, res) => {
    if (!validateExerciseBody(req.body)) {
        return res.status(400).json({ Error: "Invalid request" });
    }

    try {
        const createdExercise = await createExercise(req.body);
        res.status(201).json(createdExercise);
    } catch (error) {
        handleMongooseErrors(error, res);
    }
}));

// GET all or filtered Exercises
router.get('/exercises', asyncHandler(async (req, res) => {
    const filter = {};

    // Applies filters if provided in query parameters
    ['name', 'unit', 'date'].forEach(field => {
        if (req.query[field]) filter[field] = req.query[field];
    });

    // Handles numeric fields
    ['reps', 'weight'].forEach(field => {
        if (req.query[field]) filter[field] = Number(req.query[field]);
    });

    const foundExercises = await findExercises(filter);
    res.status(200).json(foundExercises);
}));

// GET Exercise by ID
router.get('/exercises/:id', asyncHandler(async (req, res) => {
    try {
        const exercise = await findExerciseById(req.params.id);

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
        // We'll rely on the model function to validate the input
        // since it includes runValidators:true
        const updatedExercise = await updateExerciseById(req.params.id, req.body);

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

    // Applies the first filter found
    if (name) filter.name = name;
    else if (reps) filter.reps = Number(reps);
    else if (weight) filter.weight = Number(weight);
    else if (unit) filter.unit = unit;
    else if (date) filter.date = date;
    else {
        return res.status(400).json({ Error: "Missing required query parameter." });
    }

    const result = await deleteExercises(filter);
    res.status(200).json({ deletedCount: result.deletedCount });
}));

// DELETE Exercise by ID
router.delete('/exercises/:id', asyncHandler(async (req, res) => {
    try {
        const result = await deleteExerciseById(req.params.id);

        if (!result) {
            return res.status(404).json({ Error: "Not found" });
        }

        res.status(204).send();
    } catch (error) {
        handleMongooseErrors(error, res);
    }
}));

export default router;

