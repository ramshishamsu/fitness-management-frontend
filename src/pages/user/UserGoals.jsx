import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Target, TrendingUp, Calendar, Award, Activity } from "lucide-react";
import UserLayout from "../../components/common/UserLayout";

const UserGoals = () => {
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);
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
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("goals");

  // Load goals and progress
  useEffect(() => {
    loadGoalsAndProgress();
  }, []);

  const loadGoalsAndProgress = async () => {
    try {
      const [goalsRes, progressRes] = await Promise.all([
        axiosInstance.get("/goals"),
        axiosInstance.get("/progress")
      ]);
      
      setGoals(goalsRes.data);
      setProgress(progressRes.data);
      console.log("✅ Goals loaded:", goalsRes.data);
      console.log("✅ Progress loaded:", progressRes.data);
    } catch (err) {
      console.error("Failed to load goals:", err);
      setError("Failed to load goals and progress");
    } finally {
      setLoading(false);
    }
  };

  const submitGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.targetValue || !newGoal.targetDate) return;

    setSubmitting(true);
    try {
      const goalData = {
        ...newGoal,
        targetValue: parseFloat(newGoal.targetValue),
        currentValue: parseFloat(newGoal.currentValue) || 0,
        targetDate: new Date(newGoal.targetDate),
        milestones: newGoal.milestones.map(m => ({
          title: m.title,
          targetValue: parseFloat(m.targetValue),
          completed: false
        }))
      };

      const res = await axiosInstance.post("/goals", goalData);
      setGoals([res.data, ...goals]);
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
      setShowGoalForm(false);
      console.log("✅ Goal created:", res.data);
    } catch (err) {
      console.error("Failed to create goal:", err);
      setError("Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  const updateProgress = async (goalId, value) => {
    try {
      const res = await axiosInstance.post("/progress", {
        goalId,
        value: parseFloat(value),
        date: new Date()
      });

      setProgress(progress.map(p => 
        p.goalId === goalId ? res.data : p
      ));

      // Update goal's current value
      setGoals(goals.map(g => 
        g._id === goalId ? {...g, currentValue: parseFloat(value)} : g
      ));

      console.log("✅ Progress updated:", res.data);
    } catch (err) {
      console.error("Failed to update progress:", err);
      setError("Failed to update progress");
    }
  };

  const deleteGoal = async (goalId) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      await axiosInstance.delete(`/goals/${goalId}`);
      setGoals(goals.filter(g => g._id !== goalId));
      setProgress(progress.filter(p => p.goalId !== goalId));
      console.log("✅ Goal deleted:", goalId);
    } catch (err) {
      console.error("Failed to delete goal:", err);
      setError("Failed to delete goal");
    }
  };

  const calculateProgress = (goal) => {
    if (!goal.currentValue || !goal.targetValue) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "text-green-400";
    if (percentage >= 75) return "text-blue-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      weight_loss: "🏃️",
      muscle_gain: "💪",
      strength: "🏋️",
      endurance: "🏃️",
      flexibility: "🧘️",
      general_fitness: "⭐"
    };
    return icons[category] || "🎯";
  };

  const addMilestone = () => {
    setNewGoal({
      ...newGoal,
      milestones: [...newGoal.milestones, {
        title: "",
        targetValue: "",
        completed: false
      }]
    });
  };

  const removeMilestone = (index) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter((_, i) => i !== index)
    });
  };

  const updateMilestone = (index, field, value) => {
    const updatedMilestones = [...newGoal.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: field === 'targetValue' ? parseFloat(value) : value
    };
    setNewGoal({
      ...newGoal,
      milestones: updatedMilestones
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Fitness Goals</h1>
          <p className="text-neutral-400">Set goals and track your progress</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-neutral-400 mt-4">Loading goals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Target className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Goals List */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">My Goals</h2>
                <button
                  onClick={() => setShowGoalForm(!showGoalForm)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
                >
                  {showGoalForm ? "Cancel" : "New Goal"}
                </button>
              </div>

              {showGoalForm && (
                <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Create New Goal</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Goal Title</label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Lose 10kg in 3 months"
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Describe your goal and motivation..."
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none h-20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                        className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                      >
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="strength">Strength</option>
                        <option value="endurance">Endurance</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="general_fitness">General Fitness</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Target Date</label>
                      <input
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                        className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Target Value</label>
                      <input
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                        placeholder="e.g., 70"
                        className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Unit</label>
                      <select
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-primary focus:outline-none"
                      >
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                        <option value="cm">cm</option>
                        <option value="inches">inches</option>
                        <option value="minutes">minutes</option>
                        <option value="hours">hours</option>
                      </select>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-neutral-300">Milestones</label>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-600 transition"
                      >
                        Add Milestone
                      </button>
                    </div>
                    {newGoal.milestones.map((milestone, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          placeholder="Milestone title..."
                          className="flex-1 px-3 py-1 bg-neutral-700 text-white rounded border border-neutral-600 text-sm"
                        />
                        <input
                          type="number"
                          value={milestone.targetValue}
                          onChange={(e) => updateMilestone(index, 'targetValue', e.target.value)}
                          placeholder="Target..."
                          className="w-24 px-3 py-1 bg-neutral-700 text-white rounded border border-neutral-600 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={submitGoal}
                    disabled={submitting || !newGoal.title.trim() || !newGoal.targetValue || !newGoal.targetDate}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? "Creating..." : "Create Goal"}
                  </button>
                </div>
              )}

              {/* Goals Display */}
              <div className="space-y-4">
                {goals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="mx-auto mb-4 text-neutral-600" size={48} />
                    <h3 className="text-xl font-semibold text-neutral-400 mb-2">No Goals Yet</h3>
                    <p className="text-neutral-500">
                      Create your first fitness goal to start tracking your progress!
                    </p>
                  </div>
                ) : (
                  goals.map((goal) => {
                    const progressPercentage = calculateProgress(goal);
                    const progressColor = getProgressColor(progressPercentage);
                    
                    return (
                      <div key={goal._id} className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                            <div>
                              <h4 className="font-semibold text-white">{goal.title}</h4>
                              <p className="text-sm text-neutral-400">{goal.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateProgress(goal._id, goal.currentValue + 1)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                              Update Progress
                            </button>
                            <button
                              onClick={() => deleteGoal(goal._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-neutral-400 mb-1">
                            <span>Progress: {progressPercentage.toFixed(1)}%</span>
                            <span>Target: {goal.targetValue} {goal.unit}</span>
                          </div>
                          <div className="w-full bg-neutral-700 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all ${progressColor}`}
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-sm text-neutral-300">
                          <p><strong>Current:</strong> {goal.currentValue || 0} {goal.unit}</p>
                          <p><strong>Target:</strong> {goal.targetValue} {goal.unit}</p>
                          <p><strong>Target Date:</strong> {formatDate(goal.targetDate)}</p>
                          <p><strong>Days Remaining:</strong> {Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)))}</p>
                        </div>

                        {/* Milestones */}
                        {goal.milestones && goal.milestones.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-neutral-700">
                            <h5 className="font-medium text-white mb-2">Milestones</h5>
                            <div className="space-y-2">
                              {goal.milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <span className={`w-4 h-4 rounded-full ${milestone.completed ? 'bg-green-600' : 'bg-neutral-600'}`}></span>
                                  <span className="text-neutral-300">{milestone.title}: {milestone.targetValue} {goal.unit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Progress Analytics */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-6 text-white">Progress Analytics</h2>
              
              <div className="space-y-6">
                {/* Overall Progress */}
                <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-400" />
                    Overall Progress
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Active Goals:</span>
                      <span className="text-white font-medium">{goals.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Completed Goals:</span>
                      <span className="text-green-400 font-medium">{goals.filter(g => calculateProgress(g) >= 100).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Average Progress:</span>
                      <span className="text-blue-400 font-medium">
                        {goals.length > 0 
                          ? (goals.reduce((sum, g) => sum + calculateProgress(g), 0) / goals.length).toFixed(1) + '%'
                          : '0%'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-blue-400" />
                    Recent Activity
                  </h3>
                  
                  <div className="space-y-2">
                    {progress.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        <div className="flex-1">
                          <p className="text-neutral-300">
                            Updated goal to <span className="text-white font-medium">{item.value}</span> {item.unit}
                          </p>
                          <p className="text-neutral-500 text-xs">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {progress.length === 0 && (
                      <p className="text-neutral-500 text-center py-4">
                        No progress updates yet. Start tracking your goals!
                      </p>
                    )}
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Award size={20} className="text-yellow-400" />
                    Achievements
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {goals.filter(g => calculateProgress(g) >= 100).length > 0 && (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">🏆</span>
                        </div>
                        <p className="text-green-400 font-medium">Goal Crusher</p>
                        <p className="text-neutral-500 text-xs">Completed goals</p>
                      </div>
                    )}
                    
                    {goals.filter(g => calculateProgress(g) >= 50).length > goals.filter(g => calculateProgress(g) >= 100).length && (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">🔥</span>
                        </div>
                        <p className="text-blue-400 font-medium">Half Way There</p>
                        <p className="text-neutral-500 text-xs">50%+ progress</p>
                      </div>
                    )}
                    
                    {goals.length >= 3 && (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">⭐</span>
                        </div>
                        <p className="text-purple-400 font-medium">Goal Setter</p>
                        <p className="text-neutral-500 text-xs">3+ goals set</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserGoals;
