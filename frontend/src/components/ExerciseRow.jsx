import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ExerciseRow({ exercise, onDelete }) {
    // Format date from ISO string to MM-DD-YY format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(2);
        return `${month}-${day}-${year}`;
    };

    return (
        <tr>
            <td>{exercise.name}</td>
            <td>{exercise.reps}</td>
            <td>{exercise.weight}</td>
            <td>{exercise.unit}</td>
            <td>{formatDate(exercise.date)}</td>
            <td className="actions-cell">
                <Link to={`/edit/${exercise._id}`} state={{ exercise }} className="edit-icon" title="Edit">
                    <FaEdit />
                </Link>
                <button 
                    onClick={() => onDelete(exercise._id)} 
                    className="delete-icon" 
                    title="Delete"
                >
                    <FaTrash />
                </button>
            </td>
        </tr>
    );
}

export default ExerciseRow;

