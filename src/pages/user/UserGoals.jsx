import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Target, TrendingUp, Award, Activity } from "lucide-react";

const UserGoals = () => {
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "weight_loss",
    targetValue: "",
    currentValue: "",
    unit: "kg",
    targetDate: "",
    milestones: []
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadGoalsAndProgress();
  }, []);

  const loadGoalsAndProgress = async () => {
    try {
      const [goalsRes, progressRes] = await Promise.all([
        axiosInstance.get("/goals").catch(() => ({ data: { goals: [] } })),
        axiosInstance.get("/progress").catch(() => ({ data: { progressLogs: [] } }))
      ]);

      setGoals(goalsRes.data?.goals || []);
      setProgress(progressRes.data?.progressLogs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const calculateProgress = (goal) => {
    if (goal.currentValue == null || goal.targetValue == null) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const progressColor = (p) => {
    if (p >= 100) return "bg-green-500";
    if (p >= 75) return "bg-blue-500";
    if (p >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  /* ================= CREATE GOAL ================= */

  const submitGoal = async () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.targetDate) return;

    setSubmitting(true);
    try {
      const payload = {
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        targetValue: Number(newGoal.targetValue),
        currentValue: Number(newGoal.currentValue || 0),
        unit: newGoal.unit,
        targetDate: new Date(newGoal.targetDate)
      };

      console.log('Creating goal with payload:', payload);
      const res = await axiosInstance.post("/goals", payload);
      console.log('Goal created successfully:', res.data);
      
      setGoals([res.data, ...goals]);
      setShowGoalForm(false);
      setNewGoal({
        title: "",
        description: "",
        category: "weight_loss",
        targetValue: "",
        currentValue: "",
        unit: "kg",
        targetDate: "",
        milestones: []
      });
    } catch (err) {
      console.error('Failed to create goal:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || "Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UPDATE PROGRESS ================= */

  const updateProgress = async (goalId, value) => {
    try {
      console.log('Updating progress:', { goalId, value });
      const res = await axiosInstance.post("/progress", {
        goalId,
        value: Number(value),
        date: new Date()
      });

      console.log('Progress updated successfully:', res.data);
      setProgress([res.data, ...progress.filter(p => p.goalId !== goalId)]);
      setGoals(goals.map(g =>
        g._id === goalId ? { ...g, currentValue: value } : g
      ));
    } catch (err) {
      console.error('Failed to update progress:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || "Failed to update progress");
    }
  };

  /* ================= DELETE GOAL ================= */

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    try {
      console.log('Deleting goal:', id);
      await axiosInstance.delete(`/goals/${id}`);
      console.log('Goal deleted successfully');
      setGoals(goals.filter(g => g._id !== id));
      setProgress(progress.filter(p => p.goalId !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || "Failed to delete goal");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="text-center py-16 text-neutral-400">Loading goals…</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">My Goals</h1>
        <button
          onClick={() => setShowGoalForm(!showGoalForm)}
          className="bg-emerald-500 px-4 py-2 rounded-lg text-black font-medium hover:bg-emerald-600 transition-colors w-full sm:w-auto"
        >
          {showGoalForm ? "Cancel" : "New Goal"}
        </button>
      </div>

      {showGoalForm && (
        <div className="bg-neutral-800 p-4 sm:p-6 rounded-lg mb-6">
          <div className="space-y-4">
            <input
              placeholder="Goal title"
              className="w-full px-4 py-3 bg-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Target value"
                className="w-full px-4 py-3 bg-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
              />
              <input
                type="date"
                className="w-full px-4 py-3 bg-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              />
            </div>
            <button
              onClick={submitGoal}
              disabled={submitting}
              className="w-full bg-emerald-500 py-3 rounded-lg text-black font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating…" : "Create Goal"}
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-neutral-400">
          <Target size={48} className="mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">No goals yet</p>
          <p className="text-sm text-neutral-500">Create your first fitness goal to start tracking your progress!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {goals.map(goal => {
            const percent = calculateProgress(goal);
            return (
              <div key={goal._id} className="bg-neutral-800 p-4 sm:p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1 truncate">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-neutral-400 line-clamp-2">{goal.description}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteGoal(goal._id)} 
                    className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="w-full bg-neutral-700 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${progressColor(percent)}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <p className="text-sm text-neutral-400">
                      <span className="font-medium text-white">{goal.currentValue || 0}/{goal.targetValue}</span> {goal.unit}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500">
                      Target: {formatDate(goal.targetDate)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => updateProgress(goal._id, (goal.currentValue || 0) + 1)}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Update Progress
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateProgress(goal._id, Math.max(0, (goal.currentValue || 0) - 1))}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                      >
                        -
                      </button>
                      <span className="text-white font-medium min-w-[3rem] text-center">
                        {goal.currentValue || 0}
                      </span>
                      <button
                        onClick={() => updateProgress(goal._id, (goal.currentValue || 0) + 1)}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserGoals;
