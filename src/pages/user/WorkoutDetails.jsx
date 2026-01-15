import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

const WorkoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/workouts/${id}`).then(res => {
      setWorkout(res.data);
    });
  }, [id]);

  const markCompleted = async () => {
    await axiosInstance.patch(`/workouts/${id}/complete`);
    navigate("/user/my-workouts");
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{workout.title}</h1>

      <p className="text-gray-400 mb-4">
        Trainer: {workout.trainer?.userId?.name}
      </p>

      <h2 className="text-xl font-semibold mb-2">Exercises</h2>

      {workout.exercises.map((ex, i) => (
        <div key={i} className="mb-3 p-4 bg-neutral-900 rounded">
          <p>Name: {ex.name}</p>
          <p>Sets: {ex.sets}</p>
          <p>Reps: {ex.reps}</p>
          <p>Calories: {ex.calories}</p>
        </div>
      ))}

      {!workout.completed && (
        <button
          onClick={markCompleted}
          className="mt-6 px-6 py-3 bg-green-600 rounded hover:bg-green-700"
        >
          Mark as Completed
        </button>
      )}
    </div>
  );
};

export default WorkoutDetails;
