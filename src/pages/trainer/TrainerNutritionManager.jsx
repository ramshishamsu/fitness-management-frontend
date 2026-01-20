import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

/* ===== ENUMS (MATCH BACKEND) ===== */
const GOAL_TYPES = [
  "weight_loss",
  "muscle_gain",
  "maintenance",
  "performance",
];

const MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "pre_workout",
  "post_workout",
];

const TrainerNutritionManager = () => {
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    clientId: "",
    name: "",
    goalType: "weight_loss",
    dailyCalories: 2000,
    duration: 7,
    startDate: "",
  });

  const [meals, setMeals] = useState([
    {
      mealType: "breakfast",
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    },
  ]);

  /* ================= FETCH DATA ================= */

  const fetchPlans = async () => {
    const res = await axios.get("/nutrition-plans");
    setPlans(res.data.nutritionPlans || []);
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("/trainers/clients");
      console.log("Clients data:", res.data); // Debug log
      setClients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchPlans(), fetchClients()])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ================= MEALS ================= */

  const addMeal = () => {
    setMeals([
      ...meals,
      {
        mealType: "breakfast",
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      },
    ]);
  };

  const updateMeal = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  /* ================= SAVE PLAN ================= */

  const savePlan = async () => {
    if (!form.clientId || !form.name || !form.startDate) {
      return alert("Please fill all required fields");
    }

    const validMeals = meals.filter((m) => m.name && m.calories);
    if (validMeals.length === 0) {
      return alert("Please add at least one valid meal");
    }

    const payload = {
      clientId: form.clientId,
      name: form.name,
      duration: Number(form.duration),
      startDate: form.startDate,
      goals: {
        goalType: form.goalType,
        dailyCalories: Number(form.dailyCalories),
      },
      dailyPlans: [
        {
          day: 1,
          meals: validMeals.map((m) => ({
            mealType: m.mealType,
            name: m.name,
            calories: Number(m.calories),
            protein: Number(m.protein || 0),
            carbs: Number(m.carbs || 0),
            fat: Number(m.fat || 0),
          })),
        },
      ],
    };

    try {
      if (editingId) {
        await axios.put(`/nutrition-plans/${editingId}`, payload);
        alert("Nutrition plan updated ✅");
      } else {
        await axios.post("/nutrition-plans", payload);
        alert("Nutrition plan created ✅");
      }

      resetForm();
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save plan");
    }
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setForm({
      clientId: "",
      name: "",
      goalType: "weight_loss",
      dailyCalories: 2000,
      duration: 7,
      startDate: "",
    });
    setMeals([
      {
        mealType: "breakfast",
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      },
    ]);
  };

  /* ================= EDIT ================= */

  const editPlan = (plan) => {
    setEditingId(plan._id);
    setForm({
      clientId: plan.clientId?._id,
      name: plan.name,
      goalType: plan.goals?.goalType,
      dailyCalories: plan.goals?.dailyCalories,
      duration: plan.duration,
      startDate: plan.startDate.split("T")[0],
    });
    setMeals(plan.dailyPlans?.[0]?.meals || []);
    setShowForm(true);
  };

  /* ================= DELETE ================= */

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this nutrition plan?")) return;
    await axios.delete(`/nutrition-plans/${id}`);
    fetchPlans();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Trainer Nutrition Plans</h1>

        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Nutrition Plan
        </button>

        {showForm && (
          <div className="max-w-4xl mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {editingId ? "Edit Nutrition Plan" : "Create Nutrition Plan"}
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); savePlan(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* CLIENT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client</label>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Client</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PLAN NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Name</label>
                <input
                  placeholder="Plan Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* GOAL ENUM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal Type</label>
                <select
                  value={form.goalType}
                  onChange={(e) => setForm({ ...form, goalType: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {GOAL_TYPES.map((g) => (
                    <option key={g} value={g}>
                      {g.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* DAILY CALORIES */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Daily Calories</label>
                <input
                  type="number"
                  value={form.dailyCalories}
                  onChange={(e) => setForm({ ...form, dailyCalories: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* DURATION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (days)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* START DATE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* MEALS */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Meals (Day 1)</h3>

                {meals.map((meal, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Type</label>
                        <select
                          value={meal.mealType}
                          onChange={(e) => updateMeal(index, "mealType", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {MEAL_TYPES.map((m) => (
                            <option key={m} value={m}>
                              {m.replace("_", " ").toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Name</label>
                        <input
                          placeholder="Meal Name"
                          value={meal.name}
                          onChange={(e) => updateMeal(index, "name", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calories</label>
                        <input
                          type="number"
                          placeholder="Calories"
                          value={meal.calories}
                          onChange={(e) => updateMeal(index, "calories", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Protein (g)</label>
                        <input
                          type="number"
                          placeholder="Protein"
                          value={meal.protein}
                          onChange={(e) => updateMeal(index, "protein", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Carbs (g)</label>
                        <input
                          type="number"
                          placeholder="Carbs"
                          value={meal.carbs}
                          onChange={(e) => updateMeal(index, "carbs", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fat (g)</label>
                        <input
                          type="number"
                          placeholder="Fat"
                          value={meal.fat}
                          onChange={(e) => updateMeal(index, "fat", e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {meals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeal(index)}
                        className="mt-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Remove Meal
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMeal}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add Meal
                </button>
              </div>

              {/* FORM ACTIONS */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Plan" : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PLAN LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Client: {plan.clientId?.name || "Unassigned"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Goal: {plan.goals?.goalType?.replace("_", " ").toUpperCase() || "N/A"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Duration: {plan.duration} days
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => editPlan(plan)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => deletePlan(plan._id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerNutritionManager;
