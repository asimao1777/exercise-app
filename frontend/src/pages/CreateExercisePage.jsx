import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExerciseForm from '../components/ExerciseForm';

/**
 * Page component for creating a new exercise
 */
const CreateExercisePage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Format today's date as YYYY-MM-DD for the date input default
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  // Initial values for the form
  const initialValues = {
    name: '',
    reps: '',
    weight: '',
    unit: 'kgs',
    date: formattedDate
  };

  // Function to handle form submission
  const handleSubmit = async (formData) => {
    try {
      // Create a copy of the form data
      const updatedFormData = { ...formData };
      
      // Convert date from YYYY-MM-DD to MM-DD-YY
      if (updatedFormData.date) {
        const dateParts = updatedFormData.date.split('-');
        if (dateParts.length === 3) {
          const year = dateParts[0].slice(-2); // Get last 2 digits of year
          const month = dateParts[1];
          const day = dateParts[2];
          updatedFormData.date = `${month}-${day}-${year}`;
        }
      }
      
      // Send the data to the API with the converted date
      const response = await axios.post('/exercises', updatedFormData);
      
      // If successful, show success message and redirect to home page
      if (response.status === 201) {
        alert('Exercise created successfully!');
        navigate('/');
      } else {
        // Shouldn't get here based on API design, but just in case
        alert('Failed to create exercise. Please try again.');
        navigate('/');
      }
    } catch (err) {
      // If error, show error message and redirect to home page
      setError(err.message || 'An error occurred while creating the exercise');
      alert(`Failed to create exercise: ${err.message}`);
      navigate('/');
    }
  };

  return (
    <div className="create-exercise-page">
      <h2>Create New Exercise</h2>
      {error && <p className="error-message">{error}</p>}
      <ExerciseForm 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonText="Create Exercise"
      />
    </div>
  );
};

export default CreateExercisePage;

