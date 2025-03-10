import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ExerciseTable from '../components/ExerciseTable';
import { FaPlus } from 'react-icons/fa';

function HomePage() {
    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState(null);

    const loadExercises = async () => {
        try {
            const response = await axios.get('/exercises');
            setExercises(response.data);
        } catch (err) {
            console.error('Error loading exercises:', err);
            setError('Failed to load exercises. Please try again later.');
        }
    };

    useEffect(() => {
        loadExercises();
    }, []);

    const onDelete = async (id) => {
        try {
            await axios.delete(`/exercises/${id}`);
            setExercises(exercises.filter(exercise => exercise._id !== id));
        } catch (err) {
            console.error('Error deleting exercise:', err);
            alert('Failed to delete the exercise. Please try again.');
        }
    };

    return (
        <main className="home-page">
            <h2>Exercise List</h2>
            <div className="add-exercise-container">
                <Link to="/create" className="add-button">
                    <FaPlus /> Add New Exercise
                </Link>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            {exercises.length === 0 && !error ? (
                <p>No exercises found. Add your first exercise!</p>
            ) : (
                <ExerciseTable exercises={exercises} onDelete={onDelete} />
            )}
        </main>
    );
}

export default HomePage;

