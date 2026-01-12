import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { CheckCircle2, Circle, Dumbbell } from "lucide-react";

const MyWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCompleted, setFilterCompleted] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = filterCompleted !== null ? { completed: filterCompleted } : {};
    axiosInstance
      .get("/workouts/my", { params })
      .then((res) => {
        setWorkouts(Array.isArray(res.data) ? res.data : res.data.workouts || []);
      })
      .catch((err) => console.error("Failed to fetch workouts:", err))
      .finally(() => setLoading(false));
  }, [filterCompleted]);

  const assignedWorkouts = workouts.filter((w) => w.trainer && !w.completed);
  const completedWorkouts = workouts.filter((w) => w.completed);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Workouts</h1>
        <p className="text-neutral-400">Track your assigned and completed workouts</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterCompleted(null)}
          className={`px-4 py-2 rounded transition ${
            filterCompleted === null
              ? "bg-primary text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterCompleted(false)}
          className={`px-4 py-2 rounded transition ${
            filterCompleted === false
              ? "bg-primary text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterCompleted(true)}
          className={`px-4 py-2 rounded transition ${
            filterCompleted === true
              ? "bg-primary text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Assigned Workouts Section */}
      {assignedWorkouts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Dumbbell className="text-primary" size={24} />
            Assigned Workouts
          </h2>
          <div className="grid gap-4">
            {assignedWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 rounded-lg border border-neutral-700 hover:border-primary transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{workout.title}</h3>
                    {workout.description && (
                      <p className="text-neutral-400 text-sm mt-1">{workout.description}</p>
                    )}
                  </div>
                  <span className="flex items-center gap-2 px-3 py-1 bg-orange-900 bg-opacity-30 text-orange-300 text-xs rounded-full">
                    <Circle size={12} fill="currentColor" />
                    Pending
                  </span>
                </div>

                {/* Exercises */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="space-y-2 mb-4 bg-black bg-opacity-20 p-4 rounded">
                    {workout.exercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{ex.name}</span>
                        <div className="flex gap-4 text-neutral-400">
                          {ex.sets && <span>{ex.sets} sets</span>}
                          {ex.reps && <span>{ex.reps} reps</span>}
                          {ex.calories && <span>{ex.calories} cal</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-4 text-sm text-neutral-400">
                  {workout.totalDuration && (
                    <span>⏱️ {workout.totalDuration} min</span>
                  )}
                  {workout.totalCalories && (
                    <span>🔥 {workout.totalCalories} cal</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Workouts Section */}
      {completedWorkouts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={24} />
            Completed Workouts
          </h2>
          <div className="grid gap-4">
            {completedWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 rounded-lg border border-neutral-700 border-opacity-50 opacity-75"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-300">{workout.title}</h3>
                    {workout.description && (
                      <p className="text-neutral-500 text-sm mt-1">{workout.description}</p>
                    )}
                  </div>
                  <span className="flex items-center gap-2 px-3 py-1 bg-green-900 bg-opacity-30 text-green-300 text-xs rounded-full">
                    <CheckCircle2 size={12} />
                    Completed
                  </span>
                </div>

                {/* Exercises */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="space-y-2 mb-4 bg-black bg-opacity-20 p-4 rounded">
                    {workout.exercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-neutral-400">{ex.name}</span>
                        <div className="flex gap-4 text-neutral-500">
                          {ex.sets && <span>{ex.sets} sets</span>}
                          {ex.reps && <span>{ex.reps} reps</span>}
                          {ex.calories && <span>{ex.calories} cal</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && workouts.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="mx-auto mb-4 text-neutral-600" size={48} />
          <h3 className="text-xl font-semibold text-neutral-400 mb-2">No workouts yet</h3>
          <p className="text-neutral-500">
            Your assigned workouts will appear here. Connect with a trainer to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyWorkouts;
