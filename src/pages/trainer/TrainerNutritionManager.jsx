import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";

const TrainerNutritionManager = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    meals: [
      {
        type: 'breakfast',
        name: '',
        time: '08:00 AM',
        foods: [
          {
            name: '',
            quantity: 100,
            unit: 'grams',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          }
        ],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0
      }
    ],
    waterIntake: 2.0,
    notes: '',
    dailyGoals: {
      calories: 2000,
      protein: 50,
      carbs: 250,
      fat: 65,
      water: 2.5
    }
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchClientNutrition();
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get('/trainers/clients');
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const fetchClientNutrition = async () => {
    try {
      const response = await axiosInstance.get(`/nutrition/client/${selectedClient}`);
      setNutritionLogs(response.data);
    } catch (error) {
      console.error('Error fetching client nutrition:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/nutrition/client/${selectedClient}`, formData);
      alert('Nutrition plan created successfully!');
      fetchClientNutrition();
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      alert('Failed to create nutrition plan');
    }
  };

  const updateMealField = (mealIndex, field, value) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex][field] = value;
    setFormData({ ...formData, meals: updatedMeals });
  };

  const updateFoodField = (mealIndex, foodIndex, field, value) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[mealIndex].foods[foodIndex][field] = value;
    
    // Recalculate meal totals
    const foods = updatedMeals[mealIndex].foods;
    updatedMeals[mealIndex].totalCalories = foods.reduce((sum, food) => sum + Number(food.calories || 0), 0);
    updatedMeals[mealIndex].totalProtein = foods.reduce((sum, food) => sum + Number(food.protein || 0), 0);
    updatedMeals[mealIndex].totalCarbs = foods.reduce((sum, food) => sum + Number(food.carbs || 0), 0);
    updatedMeals[mealIndex].totalFat = foods.reduce((sum, food) => sum + Number(food.fat || 0), 0);
    
    setFormData({ ...formData, meals: updatedMeals });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Nutrition Manager</h1>
      
      {/* Client Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Client</label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Choose a client...</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name} ({client.email})
            </option>
          ))}
        </select>
      </div>

      {selectedClient && (
        <>
          {/* Nutrition Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Nutrition Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Water Intake (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waterIntake}
                  onChange={(e) => setFormData({ ...formData, waterIntake: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Daily Goals */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Daily Goals</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Calories</label>
                  <input
                    type="number"
                    value={formData.dailyGoals.calories}
                    onChange={(e) => setFormData({
                      ...formData,
                      dailyGoals: { ...formData.dailyGoals, calories: parseInt(e.target.value) }
                    })}
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.dailyGoals.protein}
                    onChange={(e) => setFormData({
                      ...formData,
                      dailyGoals: { ...formData.dailyGoals, protein: parseInt(e.target.value) }
                    })}
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.dailyGoals.carbs}
                    onChange={(e) => setFormData({
                      ...formData,
                      dailyGoals: { ...formData.dailyGoals, carbs: parseInt(e.target.value) }
                    })}
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={formData.dailyGoals.fat}
                    onChange={(e) => setFormData({
                      ...formData,
                      dailyGoals: { ...formData.dailyGoals, fat: parseInt(e.target.value) }
                    })}
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Water (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dailyGoals.water}
                    onChange={(e) => setFormData({
                      ...formData,
                      dailyGoals: { ...formData.dailyGoals, water: parseFloat(e.target.value) }
                    })}
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Meals</h3>
              {formData.meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="border rounded p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">Meal Type</label>
                      <select
                        value={meal.type}
                        onChange={(e) => updateMealField(mealIndex, 'type', e.target.value)}
                        className="w-full p-1 border rounded text-sm"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                        <option value="post_workout">Post Workout</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Meal Name</label>
                      <input
                        type="text"
                        value={meal.name}
                        onChange={(e) => updateMealField(mealIndex, 'name', e.target.value)}
                        className="w-full p-1 border rounded text-sm"
                        placeholder="e.g., Oatmeal with Berries"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Time</label>
                      <input
                        type="text"
                        value={meal.time}
                        onChange={(e) => updateMealField(mealIndex, 'time', e.target.value)}
                        className="w-full p-1 border rounded text-sm"
                        placeholder="e.g., 08:00 AM"
                      />
                    </div>
                  </div>

                  {/* Foods */}
                  <div className="mb-2">
                    <h4 className="text-sm font-medium mb-2">Foods</h4>
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                        <input
                          type="text"
                          value={food.name}
                          onChange={(e) => updateFoodField(mealIndex, foodIndex, 'name', e.target.value)}
                          className="p-1 border rounded text-sm"
                          placeholder="Food name"
                        />
                        <input
                          type="number"
                          value={food.quantity}
                          onChange={(e) => updateFoodField(mealIndex, foodIndex, 'quantity', e.target.value)}
                          className="p-1 border rounded text-sm"
                          placeholder="Qty"
                        />
                        <select
                          value={food.unit}
                          onChange={(e) => updateFoodField(mealIndex, foodIndex, 'unit', e.target.value)}
                          className="p-1 border rounded text-sm"
                        >
                          <option value="grams">grams</option>
                          <option value="oz">oz</option>
                          <option value="cups">cups</option>
                          <option value="pieces">pieces</option>
                          <option value="ml">ml</option>
                          <option value="tbsp">tbsp</option>
                        </select>
                        <input
                          type="number"
                          value={food.calories}
                          onChange={(e) => updateFoodField(mealIndex, foodIndex, 'calories', e.target.value)}
                          className="p-1 border rounded text-sm"
                          placeholder="Calories"
                        />
                      </div>
                    ))}
                    <div className="text-xs text-gray-600">
                      Totals: {meal.totalCalories} cal, {meal.totalProtein}g protein, {meal.totalCarbs}g carbs, {meal.totalFat}g fat
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Any special instructions or notes..."
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Nutrition Plan
            </button>
          </form>

          {/* Existing Nutrition Logs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Existing Nutrition Logs</h2>
            {nutritionLogs.length === 0 ? (
              <p className="text-gray-500">No nutrition logs found for this client.</p>
            ) : (
              <div className="space-y-4">
                {nutritionLogs.map((log) => (
                  <div key={log._id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{new Date(log.date).toLocaleDateString()}</h3>
                        <p className="text-sm text-gray-600">Water: {log.waterIntake}L</p>
                        {log.notes && <p className="text-sm text-gray-600">Notes: {log.notes}</p>}
                      </div>
                      <div className="text-right text-sm">
                        <p>Total: {log.meals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0)} cal</p>
                        <p>Protein: {log.meals.reduce((sum, meal) => sum + (meal.totalProtein || 0), 0)}g</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {log.meals.map((meal, index) => (
                        <div key={index} className="text-sm border-l-2 border-blue-200 pl-2">
                          <strong>{meal.type}:</strong> {meal.name || 'Unnamed'} ({meal.totalCalories} cal)
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerNutritionManager;
