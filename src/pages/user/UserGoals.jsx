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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">My Goals</h1>
        <button
          onClick={() => setShowGoalForm(!showGoalForm)}
          className="bg-emerald-500 px-4 py-2 rounded text-black"
        >
          {showGoalForm ? "Cancel" : "New Goal"}
        </button>
      </div>

      {showGoalForm && (
        <div className="bg-neutral-800 p-6 rounded-lg mb-6">
          <input
            placeholder="Goal title"
            className="w-full mb-3 p-2 bg-neutral-700 rounded"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Target value"
            className="w-full mb-3 p-2 bg-neutral-700 rounded"
            value={newGoal.targetValue}
            onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
          />
          <input
            type="date"
            className="w-full mb-3 p-2 bg-neutral-700 rounded"
            value={newGoal.targetDate}
            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
          />
          <button
            onClick={submitGoal}
            disabled={submitting}
            className="w-full bg-emerald-500 py-2 rounded text-black"
          >
            {submitting ? "Creating…" : "Create Goal"}
          </button>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <Target size={48} className="mx-auto mb-3" />
          No goals yet
        </div>
      ) : (
        goals.map(goal => {
          const percent = calculateProgress(goal);
          return (
            <div key={goal._id} className="bg-neutral-800 p-6 rounded-lg mb-4">
              <div className="flex justify-between mb-3">
                <h3 className="text-white font-semibold">{goal.title}</h3>
                <button onClick={() => deleteGoal(goal._id)} className="text-red-400">
                  Delete
                </button>
              </div>

              <div className="w-full bg-neutral-700 h-3 rounded-full mb-2">
                <div
                  className={`h-3 rounded-full ${progressColor(percent)}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-sm text-neutral-400">
                {goal.currentValue}/{goal.targetValue} {goal.unit} • Target {formatDate(goal.targetDate)}
              </p>

              <button
                onClick={() => updateProgress(goal._id, goal.currentValue + 1)}
                className="mt-3 text-sm bg-blue-600 px-3 py-1 rounded"
              >
                Update Progress
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserGoals;
