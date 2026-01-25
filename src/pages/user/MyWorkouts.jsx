import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { CheckCircle2, Circle, Dumbbell, Calendar, Clock, Flame, TrendingUp, Filter, Search } from "lucide-react";

const MyWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCompleted, setFilterCompleted] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, [filterCompleted]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params =
        filterCompleted !== null ? { completed: filterCompleted } : {};

      const res = await axiosInstance.get("/workouts/my", { params });
      setWorkouts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load workouts:", err);
      setError("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  const assignedWorkouts = workouts.filter(
    (w) => w.trainer && !w.completed && 
    (w.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     w.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const completedWorkouts = workouts.filter((w) => w.completed && 
    (w.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     w.description?.toLowerCase().includes(searchTerm.toLowerCase())));

  const getWorkoutStats = () => {
    const total = workouts.length;
    const completed = workouts.filter(w => w.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, completionRate };
  };

  const stats = getWorkoutStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                <Dumbbell className="text-blue-500" />
                My Workouts
              </h1>
              <p className="text-neutral-400">
                Track your assigned and completed workouts
              </p>
            </div>
          </div>
          {/* SEARCH AND FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* SEARCH */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* FILTERS */}
            <div className="flex gap-2">
              {[
                { label: "All", value: null, icon: Filter },
                { label: "Pending", value: false, icon: Circle },
                { label: "Completed", value: true, icon: CheckCircle2 },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.label}
                    onClick={() => setFilterCompleted(f.value)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                      filterCompleted === f.value
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700"
                    }`}
                  >
                    <Icon size={16} />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="text-neutral-400 mt-4">Loading workouts...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* WORKOUTS */}
        {!loading && !error && (
          <>
            {/* ASSIGNED WORKOUTS */}
            {assignedWorkouts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                  <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                  Assigned Workouts
                  <span className="text-sm bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full">
                    {assignedWorkouts.length}
                  </span>
                </h2>

                <div className="grid gap-6">
                  {assignedWorkouts.map((workout) => (
                    <div
                      key={workout._id}
                      className="group bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 rounded-2xl border border-neutral-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition">
                            {workout.title}
                          </h3>
                          
                          {workout.description && (
                            <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                              {workout.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>Assigned</span>
                            </div>
                            {workout.duration && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{workout.duration} min</span>
                              </div>
                            )}
                            {workout.calories && (
                              <div className="flex items-center gap-1">
                                <Flame size={14} />
                                <span>{workout.calories} cal</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                              <Circle size={10} fill="currentColor" />
                              Pending
                            </span>
                            {workout.trainer?.userId?.name && (
                              <span className="text-xs text-neutral-400">
                                Trainer: {workout.trainer.userId.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/user/workouts/${workout._id}`)}
                          className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-medium"
                        >
                          Start Workout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* COMPLETED WORKOUTS */}
            {completedWorkouts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                  <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                  Completed Workouts
                  <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                    {completedWorkouts.length}
                  </span>
                </h2>

                <div className="grid gap-6">
                  {completedWorkouts.map((workout) => (
                    <div
                      key={workout._id}
                      className="bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 p-6 rounded-2xl border border-neutral-700/50 opacity-75"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-300 mb-2">
                            {workout.title}
                          </h3>
                          
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                              <CheckCircle2 size={10} />
                              Completed
                            </span>
                            {workout.completedAt && (
                              <span className="text-xs text-neutral-400">
                                {new Date(workout.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/user/workouts/${workout._id}`)}
                          className="px-4 py-2 bg-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-600 transition font-medium text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EMPTY STATE */}
            {!loading && workouts.length === 0 && !error && (
              <div className="text-center py-20">
                <Dumbbell className="mx-auto mb-6 text-neutral-600" size={64} />
                <h3 className="text-xl font-semibold text-neutral-400 mb-2">
                  No workouts assigned yet
                </h3>
                <p className="text-neutral-500">
                  Your trainer will assign workouts to help you reach your fitness goals
                </p>
              </div>
            )}

            {/* NO RESULTS */}
            {!loading && !error && workouts.length > 0 && assignedWorkouts.length === 0 && completedWorkouts.length === 0 && (
              <div className="text-center py-20">
                <Search className="mx-auto mb-6 text-neutral-600" size={64} />
                <h3 className="text-xl font-semibold text-neutral-400 mb-2">
                  No workouts found
                </h3>
                <p className="text-neutral-500">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyWorkouts;