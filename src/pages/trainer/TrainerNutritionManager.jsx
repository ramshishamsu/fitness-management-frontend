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
    const res = await axios.get("/trainers/clients");
    setClients(res.data || []);
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
    <div className="p-6 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Trainer Nutrition Plans</h1>

     <button
  onClick={() => {
    setEditingId(null);
    setShowForm(true);
  }}
>
  + Create Nutrition Plan
</button>


      {showForm && (
        <div className="max-w-lg mb-8 p-4 border rounded bg-white dark:bg-neutral-900">

          <h2 className="font-semibold mb-4">
            {editingId ? "Edit Nutrition Plan" : "Create Nutrition Plan"}
          </h2>

          {/* CLIENT */}
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* PLAN NAME */}
          <input
            placeholder="Plan Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          />

          {/* GOAL ENUM */}
          <select
            value={form.goalType}
            onChange={(e) => setForm({ ...form, goalType: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          >
            {GOAL_TYPES.map((g) => (
              <option key={g} value={g}>
                {g.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Daily Calories"
            value={form.dailyCalories}
            onChange={(e) =>
              setForm({ ...form, dailyCalories: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />

          {/* MEALS */}
          <h3 className="font-semibold mb-2">Meals (Day 1)</h3>

          {meals.map((meal, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <select
                value={meal.mealType}
                onChange={(e) =>
                  updateMeal(index, "mealType", e.target.value)
                }
                className="w-full mb-2 p-2 border rounded"
              >
                {MEAL_TYPES.map((m) => (
                  <option key={m} value={m}>
                    {m.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>

              <input
                placeholder="Meal Name"
                value={meal.name}
                onChange={(e) =>
                  updateMeal(index, "name", e.target.value)
                }
                className="w-full mb-2 p-2 border rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Calories"
                  value={meal.calories}
                  onChange={(e) =>
                    updateMeal(index, "calories", e.target.value)
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="Protein"
                  value={meal.protein}
                  onChange={(e) =>
                    updateMeal(index, "protein", e.target.value)
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="Carbs"
                  value={meal.carbs}
                  onChange={(e) =>
                    updateMeal(index, "carbs", e.target.value)
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="Fat"
                  value={meal.fat}
                  onChange={(e) =>
                    updateMeal(index, "fat", e.target.value)
                  }
                  className="p-2 border rounded"
                />
              </div>

              {meals.length > 1 && (
                <button
                  onClick={() => removeMeal(index)}
                  className="mt-2 text-red-500 text-sm"
                >
                  Remove Meal
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addMeal}
            className="mb-4 px-3 py-1 bg-gray-700 text-white rounded"
          >
            + Add Meal
          </button>

          <button
            onClick={savePlan}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            Save Nutrition Plan
          </button>
        </div>
      )}

      {/* PLAN LIST */}
      {plans.map((plan) => (
        <div
          key={plan._id}
          className="mb-4 p-4 border rounded bg-white dark:bg-neutral-900"
        >
          <h3 className="font-semibold">{plan.name}</h3>
          <p>Client: {plan.clientId?.name}</p>
          <p>Goal: {plan.goals?.goalType.replace("_", " ")}</p>

          <div className="mt-2 flex gap-3">
            <button
              onClick={() => editPlan(plan)}
              className="text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => deletePlan(plan._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainerNutritionManager;
