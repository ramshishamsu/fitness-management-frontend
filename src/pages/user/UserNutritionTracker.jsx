import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock, TrendingUp, Target, ArrowLeft } from 'lucide-react';
import axios from '../../api/axios';

const UserNutritionTracker = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayLog, setTodayLog] = useState(null);
  const [loggingMeal, setLoggingMeal] = useState(false);

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
    { value: 'pre_workout', label: 'Pre-Workout', icon: '💪' },
    { value: 'post_workout', label: 'Post-Workout', icon: '🏃' }
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'skipped', label: 'Skipped', color: 'red' },
    { value: 'partial', label: 'Partial', color: 'yellow' },
    { value: 'substituted', label: 'Substituted', color: 'blue' }
  ];

  const moodOptions = [
    { value: 'excellent', label: 'Excellent', emoji: '😊' },
    { value: 'good', label: 'Good', emoji: '🙂' },
    { value: 'average', label: 'Average', emoji: '😐' },
    { value: 'poor', label: 'Poor', emoji: '😔' },
    { value: 'terrible', label: 'Terrible', emoji: '😞' }
  ];

  const energyOptions = [
    { value: 'very_high', label: 'Very High', emoji: '⚡' },
    { value: 'high', label: 'High', emoji: '🔥' },
    { value: 'medium', label: 'Medium', emoji: '🔋' },
    { value: 'low', label: 'Low', emoji: '🔻' },
    { value: 'very_low', label: 'Very Low', emoji: '🔻🔻' }
  ];

  useEffect(() => {
    if (planId) {
      fetchNutritionPlan();
      fetchLogs();
    } else {
      fetchNutritionPlans();
    }
    setLoading(false);
  }, [planId]);

  useEffect(() => {
    if (selectedDate && nutritionPlan) {
      findTodayLog();
    }
  }, [selectedDate, logs]);

  const fetchNutritionPlans = async () => {
    try {
      const response = await axios.get('/nutrition-plans');
      setNutritionPlans(response.data.nutritionPlans || []);
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
    }
  };

  const fetchNutritionPlan = async () => {
    try {
      const response = await axios.get(`/nutrition-plans/${planId}`);
      console.log('Nutrition plan data:', response.data);
      console.log('Plan structure:', {
        name: response.data.name,
        description: response.data.description,
        goals: response.data.goals,
        dailyPlans: response.data.dailyPlans,
        startDate: response.data.startDate,
        endDate: response.data.endDate,
        status: response.data.status
      });
      setNutritionPlan(response.data);
    } catch (error) {
      console.error("Error fetching nutrition plan:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`/nutrition-plans/${planId}/logs`);
      console.log('Logs data:', response.data);
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]); // Set empty array on error
    }
  };

  const findTodayLog = () => {
    const log = logs.find(log => 
      new Date(log.date).toDateString() === new Date(selectedDate).toDateString()
    );
    setTodayLog(log || null);
  };

  const getPlannedMealsForDate = () => {
    if (!nutritionPlan || !nutritionPlan.dailyPlans) {
      console.log('No nutrition plan or dailyPlans found');
      return [];
    }
    
    const startDate = new Date(nutritionPlan.startDate);
    const selectedDateObj = new Date(selectedDate);
    const dayDiff = Math.ceil((selectedDateObj - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    console.log('Finding meals for day:', dayDiff, 'from', nutritionPlan.dailyPlans?.length || 0, 'days');
    
    const dayPlan = nutritionPlan.dailyPlans.find(plan => plan.day === dayDiff);
    return dayPlan ? dayPlan.meals : [];
  };

  const updateMealStatus = (mealType, status) => {
    if (!todayLog) {
      // Create new log for today
      const newLog = {
        date: selectedDate,
        day: getDayNumber(),
        meals: getPlannedMealsForDate().map(meal => ({
          mealType: meal.mealType,
          status: meal.mealType === mealType ? status : 'skipped',
          notes: '',
          actualCalories: meal.mealType === mealType ? meal.calories : 0,
          actualProtein: meal.mealType === mealType ? meal.protein : 0,
          actualCarbs: meal.mealType === mealType ? meal.carbs : 0,
          actualFat: meal.mealType === mealType ? meal.fat : 0
        })),
        totalConsumedCalories: 0,
        adherenceScore: 0,
        notes: '',
        weight: null,
        mood: null,
        energyLevel: null
      };
      setTodayLog(newLog);
    } else {
      // Update existing log
      const updatedMeals = todayLog.meals.map(meal => 
        meal.mealType === mealType 
          ? { ...meal, status }
          : meal
      );
      
      const plannedMeal = getPlannedMealsForDate().find(meal => meal.mealType === mealType);
      
      const updatedMealsWithValues = updatedMeals.map(meal => {
        if (meal.mealType === mealType && plannedMeal) {
          return {
            ...meal,
            actualCalories: status === 'completed' ? plannedMeal.calories : 0,
            actualProtein: status === 'completed' ? plannedMeal.protein : 0,
            actualCarbs: status === 'completed' ? plannedMeal.carbs : 0,
            actualFat: status === 'completed' ? plannedMeal.fat : 0
          };
        }
        return meal;
      });
      
      setTodayLog({
        ...todayLog,
        meals: updatedMealsWithValues
      });
    }
  };

  const getDayNumber = () => {
    if (!nutritionPlan) return 1;
    const startDate = new Date(nutritionPlan.startDate);
    const selectedDateObj = new Date(selectedDate);
    return Math.ceil((selectedDateObj - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const saveTodayLog = async () => {
    if (!todayLog) return;

    try {
      setLoggingMeal(true);
      
      // Calculate adherence score
      const completedMeals = todayLog.meals.filter(meal => meal.status === 'completed').length;
      const totalMeals = todayLog.meals.length;
      const adherenceScore = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;
      
      const totalConsumedCalories = todayLog.meals.reduce((sum, meal) => 
        sum + (meal.actualCalories || 0), 0
      );

      const logData = {
        ...todayLog,
        adherenceScore,
        totalConsumedCalories
      };

      await axios.post(`/nutrition-plans/${planId}/logs`, logData);
      
      alert('Nutrition log saved successfully!');
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Error saving nutrition log:', error);
      alert('Failed to save nutrition log');
    } finally {
      setLoggingMeal(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'skipped':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'substituted':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAdherenceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalTypeLabel = (goalType) => {
    switch (goalType) {
      case 'weight_loss':
        return 'Weight Loss';
      case 'muscle_gain':
        return 'Muscle Gain';
      case 'maintenance':
        return 'Maintenance';
      case 'performance':
        return 'Performance';
      default:
        return goalType;
    }
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = (startDate, endDate, completedDays, totalDays) => {
    const totalPlanDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(100, Math.round((completedDays / totalPlanDays) * 100));
  };

  const plannedMeals = getPlannedMealsForDate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // Show nutrition plans list if no planId
  if (!planId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Nutrition Plans</h1>
          
          {nutritionPlans.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Nutrition Plans</h3>
              <p className="text-gray-600">You don't have any nutrition plans assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nutritionPlans.map(plan => (
                <div key={plan._id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => navigate(`/user/nutrition-log/${plan._id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show basic nutrition plan view if no dailyPlans
  if (!nutritionPlan || !nutritionPlan.dailyPlans || nutritionPlan.dailyPlans.length === 0) {
    if (!nutritionPlan) {
      // Show loading while nutrition plan is being fetched
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/user/nutrition-tracker')}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Plans
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{nutritionPlan.name}</h1>
            <p className="text-gray-600 mb-4">{nutritionPlan.description}</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Plan Details</h3>
              <p className="text-yellow-700">This nutrition plan is created but daily meal plans are not yet configured.</p>
              <p className="text-yellow-700">Please contact your trainer to add daily meal plans.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Daily Calories</div>
                <div className="text-xl font-bold text-gray-900">{nutritionPlan.goals?.dailyCalories || 'Not set'}</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Goal Type</div>
                <div className="text-xl font-bold text-gray-900 capitalize">
                  {nutritionPlan.goals?.goalType?.replace('_', ' ') || 'Not set'}
                </div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Duration</div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionPlan.duration || 'Not set'} days
                </div>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-xl font-bold text-gray-900 capitalize">
                  {nutritionPlan.status || 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show individual plan details
  if (!nutritionPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nutrition Plan Not Found</h2>
          <p className="text-gray-600">The nutrition plan you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/user/nutrition')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Nutrition Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/user/nutrition')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Nutrition Plans
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{nutritionPlan.name}</h1>
            <p className="text-gray-600 mb-4">{nutritionPlan.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Daily Calories</div>
                <div className="text-xl font-bold text-gray-900">{nutritionPlan.goals?.dailyCalories || 'Not set'}</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Goal Type</div>
                <div className="text-xl font-bold text-gray-900 capitalize">
                  {nutritionPlan.goals.goalType?.replace('_', ' ')}
                </div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Duration</div>
                <div className="text-xl font-bold text-gray-900">{nutritionPlan.duration} days</div>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-sm text-gray-500">Adherence Rate</div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionPlan.statistics.adherenceRate || 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection and Logging */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Nutrition Log</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={nutritionPlan.startDate}
              max={nutritionPlan.endDate}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {plannedMeals.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Day {getDayNumber()} - Nutrition Log
                {todayLog?.createdByTrainer && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Created by Trainer
                  </span>
                )}
              </h3>
              
              {plannedMeals.map((meal, index) => {
                const currentMealStatus = todayLog?.meals?.find(m => m.mealType === meal.mealType)?.status;
                const mealType = mealTypes.find(type => type.value === meal.mealType);
                const isTrainerCreated = todayLog?.createdByTrainer;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{mealType?.icon}</span>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{mealType?.label}</h4>
                          <p className="text-sm text-gray-600">{meal.name}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(currentMealStatus)}
                        {isTrainerCreated ? (
                          <div className="px-3 py-2 bg-gray-100 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">
                              {statusOptions.find(option => option.value === currentMealStatus)?.label || 'Not logged'}
                            </span>
                          </div>
                        ) : (
                          <select
                            value={currentMealStatus || 'skipped'}
                            onChange={(e) => updateMealStatus(meal.mealType, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Status</option>
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    
                    {meal.instructions && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                        <strong>Instructions:</strong> {meal.instructions}
                      </div>
                    )}
                    
                    {meal.ingredients && meal.ingredients.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-sm text-gray-700">Ingredients:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {meal.ingredients.map((ingredient, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {ingredient.quantity} {ingredient.unit} {ingredient.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Daily Summary */}
              {todayLog && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-medium text-blue-900 mb-3">Daily Summary</h4>
                  {todayLog.createdByTrainer ? (
                    <div className="space-y-4">
                      <div className="text-sm text-blue-700 mb-3">
                        <strong>This log was created by your trainer</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {todayLog.weight && (
                          <div>
                            <span className="text-blue-700">Weight:</span>
                            <span className="ml-2 font-medium text-blue-900">{todayLog.weight} lbs</span>
                          </div>
                        )}
                        {todayLog.mood && (
                          <div>
                            <span className="text-blue-700">Mood:</span>
                            <span className="ml-2 font-medium text-blue-900 capitalize">
                              {moodOptions.find(m => m.value === todayLog.mood)?.emoji} {todayLog.mood}
                            </span>
                          </div>
                        )}
                        {todayLog.energyLevel && (
                          <div>
                            <span className="text-blue-700">Energy:</span>
                            <span className="ml-2 font-medium text-blue-900 capitalize">
                              {energyOptions.find(e => e.value === todayLog.energyLevel)?.emoji} {todayLog.energyLevel?.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-blue-700">Adherence:</span>
                          <span className="ml-2 font-medium text-blue-900">{todayLog.adherenceScore}%</span>
                        </div>
                      </div>
                      {todayLog.notes && (
                        <div>
                          <span className="text-blue-700">Notes:</span>
                          <span className="ml-2 text-blue-900">{todayLog.notes}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          Weight (lbs) - Optional
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={todayLog.weight || ''}
                          onChange={(e) => setTodayLog(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : null }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter today's weight"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          Mood
                        </label>
                        <select
                          value={todayLog.mood || ''}
                          onChange={(e) => setTodayLog(prev => ({ ...prev, mood: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select mood</option>
                          {moodOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.emoji} {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          Energy Level
                        </label>
                        <select
                          value={todayLog.energyLevel || ''}
                          onChange={(e) => setTodayLog(prev => ({ ...prev, energyLevel: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select energy level</option>
                          {energyOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.emoji} {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          value={todayLog.notes || ''}
                          onChange={(e) => setTodayLog(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="How did you feel today? Any challenges or successes?"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Save Button - Only show for user-created logs */}
              {todayLog && !todayLog.createdByTrainer && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={saveTodayLog}
                    disabled={loggingMeal}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loggingMeal ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {loggingMeal ? 'Saving...' : 'Save Daily Log'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Meals Planned</h3>
              <p className="text-gray-600">There are no meals planned for this date.</p>
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Nutrition Logs</h2>
          
          {logs.length > 0 ? (
            <div className="space-y-4">
              {logs.slice(0, 10).map((log, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {new Date(log.date).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-gray-600">Day {log.day}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAdherenceColor(log.adherenceScore)}`}>
                        {log.adherenceScore}% Adherence
                      </div>
                      <div className="text-sm text-gray-600">
                        {log.totalConsumedCalories} cal consumed
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                    {log.meals.map((meal, mealIndex) => {
                      const mealType = mealTypes.find(type => type.value === meal.mealType);
                      return (
                        <div key={mealIndex} className="text-center">
                          <div className="text-lg mb-1">{mealType?.icon}</div>
                          <div className="text-xs text-gray-600">{mealType?.label}</div>
                          <div className="mt-1">
                            {getStatusIcon(meal.status)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {(log.weight || log.mood || log.energyLevel || log.notes) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {log.weight && (
                          <div>
                            <span className="text-gray-600">Weight:</span>
                            <span className="ml-2 font-medium">{log.weight} lbs</span>
                          </div>
                        )}
                        {log.mood && (
                          <div>
                            <span className="text-gray-600">Mood:</span>
                            <span className="ml-2 font-medium capitalize">
                              {moodOptions.find(m => m.value === log.mood)?.emoji} {log.mood}
                            </span>
                          </div>
                        )}
                        {log.energyLevel && (
                          <div>
                            <span className="text-gray-600">Energy:</span>
                            <span className="ml-2 font-medium capitalize">
                              {energyOptions.find(e => e.value === log.energyLevel)?.emoji} {log.energyLevel?.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                      {log.notes && (
                        <div className="mt-2">
                          <span className="text-gray-600">Notes:</span>
                          <span className="ml-2">{log.notes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Nutrition Logs Yet</h3>
              <p className="text-gray-600">Start logging your daily nutrition to track your progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNutritionTracker;
