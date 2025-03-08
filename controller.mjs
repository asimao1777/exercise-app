import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import Exercise from '../models/model.mjs';

const router = express.Router();

// CREATE new Exercise
router.post('/exercises', asyncHandler(async (req, res) => {
    const exercise = new Exercise(req.body);
    const createdExercise = await exercise.save();
    res.status(201).json(createdExercise);
}));

// GET all or filtered Exercises
router.get('/exercises', asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.name) filter.name = req.query.name;
    if (req.query.reps) filter.reps = Number(req.query.reps);
    if (req.query.weight) filter.weight = Number(req.query.weight);
    if (req.query.unit) filter.unit = req.query.unit;
    if (req.query.date) filter.date = req.query.date;

    const foundExercises = await Exercise.find(filter);
    res.status(200).json(foundExercises);
}));

// GET Exercise by ID
router.get('/exercises/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
        return res.status(404).json({ "Error": "Exercise not found" });
    }

    res.status(200).json(exercise);
}));

// UPDATE Exercise by ID
router.put('/exercises/:id', asyncHandler(async (req, res) => {
    const updates = req.body;
    const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedExercise) {
    return res.status(404).json({ "Error": "Exercise not found" });
    }

    res.status(200).json(updatedExercise);
}));

// DELETE Exercises by filter
router.delete('/exercises', asyncHandler(async (req, res) => {
    const filter = {};
    const { name, reps, weight, unit, date } = req.query;

    if (name) filter.name = name;
    else if (reps) filter.reps = Number(reps);
    else if (weight) filter.weight = Number(weight);
    else if (unit) filter.unit = unit;
    else if (date) filter.date = date;
    else {
    return res.status(400).json({ "Error": "Missing required query parameter." });
}

    const result = await Exercise.deleteMany(filter);
    res.status(200).json({ deletedCount: result.deletedCount });
}));

// DELETE Exercise by ID
router.delete('/exercises/:id', asyncHandler(async (req, res) => {
    const result = await Exercise.findByIdAndDelete(req.params.id);

    if (!result) {
    return res.status(404).json({ "Error": "Exercise not found" });
    }

    res.status(204).send();
}));

export default router;
