import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

  /* ================= FETCH ================= */

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

  /* ================= TODAY LOG ================= */

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

  /* ================= HELPERS ================= */

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

    // fallback to day 1 if exact day not found
    const dayPlan =
      nutritionPlan.dailyPlans.find((d) => d.day === day) ||
      nutritionPlan.dailyPlans[0];

    return dayPlan?.meals || [];
  };

  /* ================= UPDATE MEAL ================= */

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

  /* ================= SAVE LOG ================= */

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

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>;

  /* -------- PLAN LIST -------- */
  if (!planId) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Nutrition Plans</h1>

        {nutritionPlans.length === 0 && <p>No plans assigned</p>}

        {nutritionPlans.map((plan) => (
          <div
            key={plan._id}
            className="border p-4 rounded mb-3 cursor-pointer"
            onClick={() =>
              navigate(`/user/nutrition-log/${plan._id}`)
            }
          >
            <h3 className="font-semibold">{plan.name}</h3>
            <p className="text-sm text-gray-600">
              {plan.goals?.goalType} • {plan.duration} days
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (!nutritionPlan) {
    return <div className="p-6">Nutrition Plan Not Found</div>;
  }

  const meals = getPlannedMealsForDate();

  /* -------- PLAN DETAIL -------- */
  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate("/user/nutrition-tracker")}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold mb-2">
        {nutritionPlan.name}
      </h1>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mb-4 border p-2 rounded w-full"
      />

      {meals.length === 0 && (
        <p className="text-gray-600">
          No meals planned for this day
        </p>
      )}

      {meals.map((meal) => {
        const status =
          todayLog?.meals?.find(
            (m) => m.mealType === meal.mealType
          )?.status || "skipped";

        return (
          <div
            key={meal.mealType}
            className="border rounded p-4 mb-4"
          >
            <h3 className="font-semibold text-lg">{meal.name}</h3>

            <p className="text-xs text-gray-600 capitalize">
              {meal.mealType.replace("_", " ")}
            </p>

            <p className="text-xs mt-1">
              {meal.calories} kcal • Protein {meal.protein}g •
              Carbs {meal.carbs}g • Fat {meal.fat}g
            </p>

            <select
              value={status}
              onChange={(e) =>
                updateMealStatus(meal.mealType, e.target.value)
              }
              className="mt-2 border p-2 rounded w-full"
            >
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
              <option value="partial">Partial</option>
            </select>
          </div>
        );
      })}

      {meals.length > 0 && (
        <button
          onClick={saveLog}
          disabled={saving}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded"
        >
          {saving ? "Saving..." : "Save Nutrition Log"}
        </button>
      )}
    </div>
  );
};

export default UserNutritionTracker;
