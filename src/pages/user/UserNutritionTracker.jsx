import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, Circle, AlertCircle, TrendingUp, Utensils, Flame, Target } from "lucide-react";

const UserNutritionTracker = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [logs, setLogs] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch functions (same as before)
  const fetchNutritionPlans = async () => {
    const res = await axios.get("/nutrition-plans");
    setNutritionPlans(res.data.nutritionPlans || []);
  };

  const fetchNutritionPlan = async () => {
    const res = await axios.get(`/nutrition-plans/${planId}`);
    setNutritionPlan(res.data);
  };

  const fetchLogs = async () => {
    const res = await axios.get(`/nutrition-plans/${planId}/logs`);
    setLogs(res.data.logs || []);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (planId) {
          await fetchNutritionPlan();
          await fetchLogs();
        } else {
          await fetchNutritionPlans();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [planId]);

  useEffect(() => {
    if (!logs.length) {
      setTodayLog(null);
      return;
    }

    const existing = logs.find(
      (l) =>
        new Date(l.date).toDateString() ===
        new Date(selectedDate).toDateString()
    );

    setTodayLog(existing || null);
  }, [logs, selectedDate]);

  const getDayNumber = () => {
    if (!nutritionPlan?.startDate) return 1;

    const start = new Date(nutritionPlan.startDate);
    const selected = new Date(selectedDate);

    const diff =
      Math.floor((selected - start) / (1000 * 60 * 60 * 24)) + 1;

    return Math.min(Math.max(diff, 1), nutritionPlan.duration);
  };

  const getPlannedMealsForDate = () => {
    if (!nutritionPlan?.dailyPlans?.length) return [];

    const day = getDayNumber();

    const dayPlan =
      nutritionPlan.dailyPlans.find((d) => d.day === day) ||
      nutritionPlan.dailyPlans[0];

    return dayPlan?.meals || [];
  };

  const updateMealStatus = (mealType, status) => {
    const plannedMeals = getPlannedMealsForDate();

    const updatedMeals = plannedMeals.map((meal) => {
      const existing = todayLog?.meals?.find(
        (m) => m.mealType === meal.mealType
      );

      const finalStatus =
        meal.mealType === mealType
          ? status
          : existing?.status || "skipped";

      return {
        mealType: meal.mealType,
        status: finalStatus,
        actualCalories:
          finalStatus === "completed" ? meal.calories : 0,
        actualProtein:
          finalStatus === "completed" ? meal.protein : 0,
        actualCarbs:
          finalStatus === "completed" ? meal.carbs : 0,
        actualFat:
          finalStatus === "completed" ? meal.fat : 0,
      };
    });

    setTodayLog({
      date: selectedDate,
      day: getDayNumber(),
      meals: updatedMeals,
    });
  };

  const saveLog = async () => {
    if (!todayLog) return;

    try {
      setSaving(true);

      const completed = todayLog.meals.filter(
        (m) => m.status === "completed"
      ).length;

      const adherenceScore = Math.round(
        (completed / todayLog.meals.length) * 100
      );

      await axios.post(`/nutrition-plans/${planId}/logs`, {
        ...todayLog,
        adherenceScore,
        totalConsumedCalories: todayLog.meals.reduce(
          (sum, m) => sum + (m.actualCalories || 0),
          0
        ),
      });

      alert("Nutrition log saved ✅");
      await fetchLogs();
    } catch (err) {
      console.error(err);
      alert("Failed to save nutrition log");
    } finally {
      setSaving(false);
    }
  };

  const getNutritionStats = () => {
    const meals = getPlannedMealsForDate();
    const completedMeals = todayLog?.meals?.filter(m => m.status === "completed") || [];
    
    const totalCalories = completedMeals.reduce((sum, m) => sum + (m.actualCalories || 0), 0);
    const totalProtein = completedMeals.reduce((sum, m) => sum + (m.actualProtein || 0), 0);
    const totalCarbs = completedMeals.reduce((sum, m) => sum + (m.actualCarbs || 0), 0);
    const totalFat = completedMeals.reduce((sum, m) => sum + (m.actualFat || 0), 0);

    const adherenceScore = todayLog?.adherenceScore || 0;

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      adherenceScore,
      completedMeals: completedMeals.length,
      totalMeals: meals.length
    };
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-green-500 border-r-transparent"></div>
        <p className="text-white mt-4">Loading nutrition plans...</p>
      </div>
    </div>
  );

  // PLAN LIST VIEW
  if (!planId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
              <Utensils className="text-green-500" />
              My Nutrition Plans
            </h1>
            <p className="text-neutral-400">
              Track your daily nutrition and meal adherence
            </p>
          </div>

          {nutritionPlans.length === 0 ? (
            <div className="text-center py-20">
              <Utensils className="mx-auto mb-6 text-neutral-600" size={64} />
              <h3 className="text-xl font-semibold text-neutral-400 mb-2">
                No nutrition plans assigned
              </h3>
              <p className="text-neutral-500">
                Your trainer will create a personalized nutrition plan for you
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {nutritionPlans.map((plan) => (
                <div
                  key={plan._id}
                  onClick={() => navigate(`/user/nutrition-log/${plan._id}`)}
                  className="group bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 rounded-2xl border border-neutral-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-green-500/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Target className="text-green-500" size={24} />
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition">
                    {plan.name}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm mb-4">
                    {plan.goals?.goalType} • {plan.duration} days
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">
                      Day {getDayNumber()} of {plan.duration}
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!nutritionPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-white">Nutrition Plan Not Found</p>
        </div>
      </div>
    );
  }

  const meals = getPlannedMealsForDate();
  const stats = getNutritionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/user/nutrition-tracker")}
            className="mb-4 flex items-center gap-2 text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Back to Plans
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {nutritionPlan.name}
              </h1>
              <p className="text-neutral-400">
                Day {getDayNumber()} of {nutritionPlan.duration}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="text-neutral-400" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs">Adherence</p>
                <p className="text-2xl font-bold text-white">{stats.adherenceScore}%</p>
              </div>
              <TrendingUp className="text-green-200" size={20} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 rounded-xl border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs">Calories</p>
                <p className="text-2xl font-bold text-white">{stats.totalCalories}</p>
              </div>
              <Flame className="text-orange-200" size={20} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Protein</p>
                <p className="text-2xl font-bold text-white">{stats.totalProtein}g</p>
              </div>
              <div className="text-blue-200 text-xs font-bold">P</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs">Carbs</p>
                <p className="text-2xl font-bold text-white">{stats.totalCarbs}g</p>
              </div>
              <div className="text-purple-200 text-xs font-bold">C</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-4 rounded-xl border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs">Fat</p>
                <p className="text-2xl font-bold text-white">{stats.totalFat}g</p>
              </div>
              <div className="text-yellow-200 text-xs font-bold">F</div>
            </div>
          </div>
        </div>

        {/* MEALS */}
        {meals.length === 0 ? (
          <div className="text-center py-20">
            <Utensils className="mx-auto mb-6 text-neutral-600" size={64} />
            <h3 className="text-xl font-semibold text-neutral-400 mb-2">
              No meals planned for this day
            </h3>
            <p className="text-neutral-500">
              Check another date or contact your trainer
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {meals.map((meal) => {
              const status =
                todayLog?.meals?.find(
                  (m) => m.mealType === meal.mealType
                )?.status || "skipped";

              const statusColors = {
                completed: "bg-green-500/20 text-green-300 border-green-500/30",
                skipped: "bg-red-500/20 text-red-300 border-red-500/30",
                partial: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
              };

              const statusIcons = {
                completed: <CheckCircle size={16} />,
                skipped: <Circle size={16} />,
                partial: <AlertCircle size={16} />
              };

              return (
                <div
                  key={meal.mealType}
                  className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 rounded-2xl border border-neutral-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-neutral-400 capitalize">
                        {meal.mealType.replace("_", " ")}
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full border ${statusColors[status]}`}>
                      {statusIcons[status]}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                      <p className="text-orange-400 text-sm font-medium">{meal.calories}</p>
                      <p className="text-neutral-400 text-xs">Calories</p>
                    </div>
                    <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                      <p className="text-blue-400 text-sm font-medium">{meal.protein}g</p>
                      <p className="text-neutral-400 text-xs">Protein</p>
                    </div>
                    <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                      <p className="text-purple-400 text-sm font-medium">{meal.carbs}g</p>
                      <p className="text-neutral-400 text-xs">Carbs</p>
                    </div>
                    <div className="bg-neutral-800/50 p-3 rounded-lg text-center">
                      <p className="text-yellow-400 text-sm font-medium">{meal.fat}g</p>
                      <p className="text-neutral-400 text-xs">Fat</p>
                    </div>
                  </div>

                  <select
                    value={status}
                    onChange={(e) =>
                      updateMealStatus(meal.mealType, e.target.value)
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="completed">✅ Completed</option>
                    <option value="skipped">❌ Skipped</option>
                    <option value="partial">⚠️ Partial</option>
                  </select>
                </div>
              );
            })}
          </div>
        )}

        {/* SAVE BUTTON */}
        {meals.length > 0 && (
          <div className="mt-8">
            <button
              onClick={saveLog}
              disabled={saving}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                saving
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-600/30"
              }`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-solid border-white border-r-transparent"></div>
                  Saving...
                </span>
              ) : (
                "Save Nutrition Log"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNutritionTracker;