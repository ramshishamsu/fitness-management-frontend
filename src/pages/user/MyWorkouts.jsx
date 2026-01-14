import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { CheckCircle2, Circle, Dumbbell } from "lucide-react";

const MyWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCompleted, setFilterCompleted] = useState(null);
  const [error, setError] = useState(null);
  const [requiresSubscription, setRequiresSubscription] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRequiresSubscription(false);

    const params =
      filterCompleted !== null ? { completed: filterCompleted } : {};

    axiosInstance
      .get("/workouts/my", { params })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.workouts || [];

        setWorkouts(data);
      })
      .catch((err) => {
        if (err.response?.data?.requiresSubscription) {
          setRequiresSubscription(true);
          setError(err.response.data.message);
        } else {
          setError("Failed to load workouts");
        }
      })
      .finally(() => setLoading(false));
  }, [filterCompleted]);

  const assignedWorkouts = workouts.filter(
    (w) => w.trainer && !w.completed
  );
  const completedWorkouts = workouts.filter((w) => w.completed);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">
          My Workouts
        </h1>
        <p className="text-neutral-400">
          Track your assigned and completed workouts
        </p>
      </div>

      {/* SUBSCRIPTION REQUIRED */}
      {requiresSubscription && (
        <div className="mb-8 p-6 bg-red-900/20 border border-red-700 rounded-lg">
          <h3 className="text-xl font-semibold text-red-300 mb-2">
            Subscription Required
          </h3>
          <p className="text-red-400 mb-4">{error}</p>

          <div className="flex gap-4">
            <button
              onClick={() => (window.location.href = "/user/plans")}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              View Plans
            </button>
            <button
              onClick={() => (window.location.href = "/user/subscription")}
              className="px-6 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      )}

      {/* FILTERS */}
      {!requiresSubscription && (
        <div className="flex gap-2 mb-6">
          {[
            { label: "All", value: null },
            { label: "Pending", value: false },
            { label: "Completed", value: true },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFilterCompleted(f.value)}
              className={`px-4 py-2 rounded transition ${
                filterCompleted === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* ASSIGNED WORKOUTS */}
      {!requiresSubscription && assignedWorkouts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Dumbbell className="text-blue-500" />
            Assigned Workouts
          </h2>

          <div className="grid gap-4">
            {assignedWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-neutral-900 p-6 rounded-lg border border-neutral-700"
              >
                <h3 className="text-xl font-semibold">
                  {workout.title}
                </h3>
                {workout.description && (
                  <p className="text-neutral-400 text-sm mt-1">
                    {workout.description}
                  </p>
                )}

                <span className="inline-flex items-center gap-2 mt-3 px-3 py-1 text-xs rounded-full bg-orange-900/30 text-orange-300">
                  <Circle size={12} fill="currentColor" />
                  Pending
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMPLETED WORKOUTS */}
      {!requiresSubscription && completedWorkouts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            Completed Workouts
          </h2>

          <div className="grid gap-4">
            {completedWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 opacity-70"
              >
                <h3 className="text-xl font-semibold text-neutral-300">
                  {workout.title}
                </h3>

                <span className="inline-flex items-center gap-2 mt-3 px-3 py-1 text-xs rounded-full bg-green-900/30 text-green-300">
                  <CheckCircle2 size={12} />
                  Completed
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EMPTY */}
      {!loading && !requiresSubscription && workouts.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="mx-auto mb-4 text-neutral-600" size={48} />
          <p className="text-neutral-500">
            No workouts yet. Connect with a trainer to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyWorkouts;
