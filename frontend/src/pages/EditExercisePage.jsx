import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import ExerciseForm from '../components/ExerciseForm';

/**
 * Page component for editing an existing exercise
 */
const EditExercisePage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedExercise, setFetchedExercise] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Get the exercise data from the location state (passed from the HomePage)
  // This follows the "lifting state up" pattern to avoid an additional API call
  const exerciseData = location.state?.exercise;

  // Function to handle form submission
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
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
      
      // Send the updated data to the API
      const response = await axios.put(`/exercises/${id}`, updatedFormData);
      
      // If successful, show success message and redirect to home page
      if (response.status === 200) {
        alert('Exercise updated successfully!');
        navigate('/');
      } else {
        // Shouldn't get here based on API design, but just in case
        alert('Failed to update exercise. Please try again.');
        navigate('/');
      }
    } catch (err) {
      // If error, show error message and redirect to home page
      setError(err.message || 'An error occurred while updating the exercise');
      alert(`Failed to update exercise: ${err.message}`);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // If we don't have the exercise data in location state, fetch it from the API
  useEffect(() => {
    if (!exerciseData && !fetchedExercise) {
      const fetchExercise = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/exercises/${id}`);
          
          if (response.status === 200) {
            setFetchedExercise(response.data);
          } else {
            alert('Failed to fetch exercise. Redirecting to home page.');
            navigate('/');
          }
        } catch (err) {
          setError(err.message || 'An error occurred while fetching the exercise');
          alert(`Failed to fetch exercise: ${err.message}`);
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      
      fetchExercise();
    }
  }, [exerciseData, fetchedExercise, id, navigate]);

  // If we're loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Get the exercise data from either location state or fetched data
  const exercise = exerciseData || fetchedExercise;
  
  // If we still don't have exercise data after fetching, show error
  if (!exercise) {
    return <div>Error: Unable to load exercise data</div>;
  }

  return (
    <div className="edit-exercise-page">
      <h2>Edit Exercise</h2>
      {error && <p className="error-message">{error}</p>}
      <ExerciseForm 
        initialValues={exercise}
        onSubmit={handleSubmit}
        submitButtonText="Update Exercise"
      />
    </div>
  );
};

export default EditExercisePage;

