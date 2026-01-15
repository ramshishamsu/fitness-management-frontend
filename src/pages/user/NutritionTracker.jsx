import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const NutritionTracker = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    category: ''
  });

  // Form states
  const [mealForm, setMealForm] = useState({
    date: new Date().toISOString().split('T')[0],
    meals: []
  });

  const [goalForm, setGoalForm] = useState({
    title: '',
    targetCalories: 2000,
    targetProtein: 50,
    targetCarbs: 250,
    targetFat: 65,
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Load nutrition data
  useEffect(() => {
    loadNutritionLogs();
    loadGoals();
    loadInsights();
  }, [filters]);

  const loadNutritionLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/nutrition/logs', { params: filters });
      setNutritionLogs(response.data.nutritionLogs || []);
    } catch (error) {
      console.error('Error loading nutrition logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGoals = async () => {
    try {
      const response = await axios.get('/nutrition/goals');
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await axios.get('/nutrition/insights', { params: filters });
      setInsights(response.data);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/nutrition/log-meal', mealForm);
      setShowAddMeal(false);
      setMealForm({
        date: new Date().toISOString().split('T')[0],
        meals: []
      });
      loadNutritionLogs();
      loadInsights();
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Error adding meal');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/nutrition/goals', goalForm);
      setShowAddGoal(false);
      setGoalForm({
        title: '',
        targetCalories: 2000,
        targetProtein: 50,
        targetCarbs: 250,
        targetFat: 65,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      loadGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Error adding goal');
    } finally {
      setLoading(false);
    }
  };

  const addFoodToMeal = () => {
    setMealForm(prev => ({
      ...prev,
      meals: [...prev.meals, {
        foods: {
          name: '',
          quantity: 0,
          unit: 'g',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        }
      }]
    }));
  };

  const updateFoodInMeal = (mealIndex, field, value) => {
    setMealForm(prev => ({
      ...prev,
      meals: prev.meals.map((meal, index) => 
        index === mealIndex 
          ? { ...meal, foods: { ...meal.foods, [field]: value } }
          : meal
      )
    }));
  };

  const removeFoodFromMeal = (mealIndex) => {
    setMealForm(prev => ({
      ...prev,
      meals: prev.meals.filter((_, index) => index !== mealIndex)
    }));
  };

  const deleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`/nutrition/goals/${goalId}`);
        loadGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const getGoalStatus = (goal) => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'expired', color: 'bg-red-100 text-red-800' };
    if (daysLeft <= 7) return { status: 'due soon', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'on track', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Tracker</h1>
          <p className="text-gray-600">Track your meals, monitor nutrition, and achieve your health goals</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowAddMeal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Meal
          </button>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Set Goal
          </button>
        </div>

        {/* Nutrition Logs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nutrition Logs</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
              <p>Loading nutrition logs...</p>
            </div>
          ) : nutritionLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No nutrition logs found for the selected date.
            </div>
          ) : (
            <div className="space-y-4">
              {nutritionLogs.map((log) => (
                <div key={log._id} className="border rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{new Date(log.date).toLocaleDateString()}</h4>
                      <p className="text-sm text-gray-600">
                        Water: {log.waterIntake || 0}L
                        {log.notes && <span> • {log.notes}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Daily Totals
                      </div>
                      <div className="text-sm text-gray-600">
                        Calories: {log.meals?.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0) || 0} cal
                      </div>
                      <div className="text-xs text-gray-500">
                        P: {log.meals?.reduce((sum, meal) => sum + (meal.totalProtein || 0), 0) || 0}g | 
                        C: {log.meals?.reduce((sum, meal) => sum + (meal.totalCarbs || 0), 0) || 0}g | 
                        F: {log.meals?.reduce((sum, meal) => sum + (meal.totalFat || 0), 0) || 0}g
                      </div>
                    </div>
                  </div>
                  
                  {/* Daily Goals */}
                  {log.dailyGoals && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <div className="text-sm font-medium text-gray-700 mb-2">Daily Goals</div>
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Cal:</span> {log.dailyGoals.calories || 0}
                        </div>
                        <div>
                          <span className="text-gray-500">Protein:</span> {log.dailyGoals.protein || 0}g
                        </div>
                        <div>
                          <span className="text-gray-500">Carbs:</span> {log.dailyGoals.carbs || 0}g
                        </div>
                        <div>
                          <span className="text-gray-500">Fat:</span> {log.dailyGoals.fat || 0}g
                        </div>
                        <div>
                          <span className="text-gray-500">Water:</span> {log.dailyGoals.water || 0}L
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Meals */}
                  <div className="space-y-3">
                    {log.meals?.map((meal, mealIndex) => (
                      <div key={mealIndex} className="border-l-4 border-blue-200 pl-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-sm capitalize">{meal.type || 'Meal'}</h5>
                            {meal.name && <p className="text-xs text-gray-600">{meal.name}</p>}
                            {meal.time && <p className="text-xs text-gray-500">{meal.time}</p>}
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">{meal.totalCalories || 0} cal</div>
                            <div className="text-xs text-gray-500">
                              P: {meal.totalProtein || 0}g | C: {meal.totalCarbs || 0}g | F: {meal.totalFat || 0}g
                            </div>
                          </div>
                        </div>
                        
                        {/* Foods */}
                        <div className="space-y-1">
                          {meal.foods?.map((food, foodIndex) => (
                            <div key={foodIndex} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">{food.name || 'Food item'}</span>
                                <span className="text-gray-500 ml-2">
                                  {food.quantity || 0} {food.unit || 'g'}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-gray-600">{food.calories || 0} cal</span>
                                <span className="text-gray-400 ml-2">
                                  P:{food.protein || 0}g C:{food.carbs || 0}g F:{food.fat || 0}g
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Goals</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
              <p>Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No goals set yet. Create your first nutrition goal!
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const status = getGoalStatus(goal);
                return (
                  <div key={goal._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg">{goal.title}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Calories:</span>
                            <span className="ml-2 font-medium">{goal.targetCalories}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Protein:</span>
                            <span className="ml-2 font-medium">{goal.targetProtein}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Carbs:</span>
                            <span className="ml-2 font-medium">{goal.targetCarbs}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Fat:</span>
                            <span className="ml-2 font-medium">{goal.targetFat}g</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                          {status.status}
                        </span>
                        <button
                          onClick={() => deleteGoal(goal._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Insights */}
        {insights && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Insights</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-medium text-blue-900">Weekly Average</h4>
                <p className="text-blue-700">
                  You've averaged {insights.weeklyAverage?.calories || 0} calories per day this week.
                </p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h4 className="font-medium text-green-900">Goal Progress</h4>
                <p className="text-green-700">
                  You're {insights.goalProgress?.percentage || 0}% of the way to your daily calorie goal.
                </p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h4 className="font-medium text-yellow-900">Recommendations</h4>
                <ul className="text-yellow-700 list-disc list-inside">
                  {insights.recommendations?.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Add Meal Modal */}
        {showAddMeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Add Meal</h3>
              
              <form onSubmit={handleAddMeal}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={mealForm.date}
                    onChange={(e) => setMealForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Foods</label>
                    <button
                      type="button"
                      onClick={addFoodToMeal}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Add Food
                    </button>
                  </div>
                  
                  {mealForm.meals.map((meal, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Food name"
                          value={meal.foods.name}
                          onChange={(e) => updateFoodInMeal(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={meal.foods.quantity}
                          onChange={(e) => updateFoodInMeal(index, 'quantity', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Unit"
                          value={meal.foods.unit}
                          onChange={(e) => updateFoodInMeal(index, 'unit', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Calories"
                          value={meal.foods.calories}
                          onChange={(e) => updateFoodInMeal(index, 'calories', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Protein (g)"
                          value={meal.foods.protein}
                          onChange={(e) => updateFoodInMeal(index, 'protein', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Carbs (g)"
                          value={meal.foods.carbs}
                          onChange={(e) => updateFoodInMeal(index, 'carbs', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Fat (g)"
                          value={meal.foods.fat}
                          onChange={(e) => updateFoodInMeal(index, 'fat', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeFoodFromMeal(index)}
                          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddMeal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Meal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Set Nutrition Goal</h3>
              
              <form onSubmit={handleAddGoal}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Weight Loss Goal"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Calories</label>
                    <input
                      type="number"
                      value={goalForm.targetCalories}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetCalories: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Protein (g)</label>
                    <input
                      type="number"
                      value={goalForm.targetProtein}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetProtein: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Carbs (g)</label>
                    <input
                      type="number"
                      value={goalForm.targetCarbs}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetCarbs: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Fat (g)</label>
                    <input
                      type="number"
                      value={goalForm.targetFat}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, targetFat: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Setting...' : 'Set Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionTracker;
