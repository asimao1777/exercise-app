import { useState } from 'react';

/**
 * A reusable form component for creating and editing exercises
 * @param {Object} props - Component props
 * @param {Object} props.initialValues - Initial values for the form fields
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {String} props.submitButtonText - Text to display on the submit button
 */
const ExerciseForm = ({ initialValues, onSubmit, submitButtonText }) => {
  const [formData, setFormData] = useState(initialValues || {
    name: '',
    reps: '',
    weight: '',
    unit: 'kgs',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Exercise Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reps">Reps:</label>
        <input
          type="number"
          id="reps"
          name="reps"
          min="1"
          value={formData.reps}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="weight">Weight:</label>
        <input
          type="number"
          id="weight"
          name="weight"
          min="1"
          value={formData.weight}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="unit">Unit:</label>
        <select
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
        >
          <option value="kgs">kgs</option>
          <option value="lbs">lbs</option>
          <option value="stone">stone</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">{submitButtonText}</button>
    </form>
  );
};

export default ExerciseForm;

