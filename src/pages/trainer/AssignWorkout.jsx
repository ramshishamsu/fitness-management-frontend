import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assignWorkout } from "../../api/workoutApi";
import Loader from "../../components/common/Loader";

/*
|--------------------------------------------------------------------------
| ASSIGN WORKOUT (TRAINER)
|--------------------------------------------------------------------------
| - Trainer assigns workout to a user
| - Calls backend API
| - Shows success / error
*/

const AssignWorkout = () => {
  const { id: userIdParam } = useParams();

  const [form, setForm] = useState({
    user: "",
    exercise: "",
    sets: "",
    reps: "",
    calories: ""
  });

  useEffect(() => {
    if (userIdParam) {
      setForm((f) => ({ ...f, user: userIdParam }));
    }
  }, [userIdParam]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | HANDLE CHANGE
  |--------------------------------------------------------------------------
  */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /*
  |--------------------------------------------------------------------------
  | HANDLE SUBMIT
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await assignWorkout(form);
      setMessage("Workout assigned successfully ✅");

      // Clear form
      setForm({
        user: "",
        exercise: "",
        sets: "",
        reps: "",
        calories: ""
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to assign workout"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assign Workout</h1>

      {loading && <Loader />}

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow border max-w-xl"
      >
        {/* USER ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="text"
            name="user"
            value={form.user}
            onChange={handleChange}
            required
            placeholder="Enter User ID"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* EXERCISE */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Exercise</label>
          <input
            type="text"
            name="exercise"
            value={form.exercise}
            onChange={handleChange}
            required
            placeholder="Push Ups"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* SETS */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Sets</label>
          <input
            type="number"
            name="sets"
            value={form.sets}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* REPS */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Reps</label>
          <input
            type="number"
            name="reps"
            value={form.reps}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* CALORIES */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Calories</label>
          <input
            type="number"
            name="calories"
            value={form.calories}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Assign Workout
        </button>
      </form>
    </div>
  );
};

export default AssignWorkout;
