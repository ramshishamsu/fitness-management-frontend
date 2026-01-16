import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, TrendingUp, Clock, ArrowLeft, Save, User, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from '../../api/axios';

const TrainerNutritionManager = () => {
  const navigate = useNavigate();
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'create-log'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [logData, setLogData] = useState({
    meals: [],
    totalConsumedCalories: 0,
    adherenceScore: 0,
    notes: '',
    weight: null,
    mood: null,
    energyLevel: null
  });

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
    fetchNutritionPlans();
  }, []);

  const fetchNutritionPlans = async () => {
    try {
      const response = await axios.get('/api/nutrition-plans');
      setNutritionPlans(response.data.nutritionPlans || []);
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
    } finally {
      setLoading(false);
    }
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

  const handleCreateLog = (plan) => {
    setSelectedPlan(plan);
    setActiveTab('create-log');
    initializeLogData(plan);
  };

  const getDayNumber = (plan) => {
    if (!plan) return 1;
    const startDate = new Date(plan.startDate);
    const selectedDateObj = new Date(selectedDate);
    return Math.ceil((selectedDateObj - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getPlannedMealsForDate = (plan) => {
    if (!plan) return [];
    
    const startDate = new Date(plan.startDate);
    const selectedDateObj = new Date(selectedDate);
    const dayDiff = Math.ceil((selectedDateObj - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const dayPlan = plan.dailyPlans.find(p => p.day === dayDiff);
    return dayPlan ? dayPlan.meals : [];
  };

  const initializeLogData = (plan) => {
    const plannedMeals = getPlannedMealsForDate(plan);
    const initialMeals = plannedMeals.map(meal => ({
      mealType: meal.mealType,
      status: 'skipped',
      notes: '',
      actualCalories: 0,
      actualProtein: 0,
      actualCarbs: 0,
      actualFat: 0
    }));

    setLogData({
      meals: initialMeals,
      totalConsumedCalories: 0,
      adherenceScore: 0,
      notes: '',
      weight: null,
      mood: null,
      energyLevel: null
    });
  };

  const updateMealStatus = (mealType, status) => {
    const updatedMeals = logData.meals.map(meal => {
      if (meal.mealType === mealType) {
        const plannedMeal = getPlannedMealsForDate(selectedPlan).find(m => m.mealType === mealType);
        
        return {
          ...meal,
          status,
          actualCalories: status === 'completed' && plannedMeal ? plannedMeal.calories : 0,
          actualProtein: status === 'completed' && plannedMeal ? plannedMeal.protein : 0,
          actualCarbs: status === 'completed' && plannedMeal ? plannedMeal.carbs : 0,
          actualFat: status === 'completed' && plannedMeal ? plannedMeal.fat : 0
        };
      }
      return meal;
    });

    const totalCalories = updatedMeals.reduce((sum, meal) => sum + (meal.actualCalories || 0), 0);
    const completedMeals = updatedMeals.filter(meal => meal.status === 'completed').length;
    const totalMeals = updatedMeals.length;
    const adherenceScore = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;

    setLogData({
      ...logData,
      meals: updatedMeals,
      totalConsumedCalories: totalCalories,
      adherenceScore: adherenceScore
    });
  };

  const saveNutritionLog = async () => {
    try {
      setSaving(true);

      const logPayload = {
        date: selectedDate,
        day: getDayNumber(selectedPlan),
        meals: logData.meals,
        totalConsumedCalories: logData.totalConsumedCalories,
        adherenceScore: logData.adherenceScore,
        notes: logData.notes,
        weight: logData.weight,
        mood: logData.mood,
        energyLevel: logData.energyLevel
      };

      await axios.post(`/api/nutrition-plans/${selectedPlan._id}/trainer-log`, logPayload);
      
      alert('Nutrition log created successfully for user!');
      setActiveTab('plans');
      setSelectedPlan(null);
      fetchNutritionPlans();
    } catch (error) {
      console.error('Error creating nutrition log:', error);
      alert('Failed to create nutrition log: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Manager</h1>
          <p className="text-gray-600">Manage nutrition plans and create logs for your clients</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'plans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Nutrition Plans
              </button>
              {selectedPlan && (
                <button
                  onClick={() => setActiveTab('create-log')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'create-log'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Create Log for {selectedPlan.clientId?.name}
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Nutrition Plans Tab */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nutritionPlans.length > 0 ? (
              nutritionPlans.map((plan) => (
                <div key={plan._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                      <span className={'px-3 py-1 rounded-full text-xs font-medium ' + getStatusColor(plan.status)}>
                        {plan.status?.charAt(0)?.toUpperCase() + plan.status?.slice(1)}
                      </span>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center mb-4">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{plan.clientId?.name || 'Client'}</span>
                    </div>

                    {/* Plan Description */}
                    {plan.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                    )}

                    {/* Plan Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {plan.duration} days • {getDaysRemaining(plan.endDate)} days remaining
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Target className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {getGoalTypeLabel(plan.goals?.goalType)} • {plan.goals?.dailyCalories} cal/day
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {plan.statistics?.adherenceRate || 0}% adherence rate
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleCreateLog(plan)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Log
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Nutrition Plans Yet</h3>
                <p className="text-gray-600">Create nutrition plans for your clients to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Create Log Tab */}
        {activeTab === 'create-log' && selectedPlan && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <button
                onClick={() => setActiveTab('plans')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
              </button>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Nutrition Log</h2>
                  <p className="text-gray-600">Log nutrition for {selectedPlan.clientId?.name || 'Client'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {selectedPlan.clientId?.name || 'Client'}
                  </span>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={selectedPlan.startDate}
                max={selectedPlan.endDate}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Meal Logging */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Day {getDayNumber(selectedPlan)} - Mark Client Meals
              </h3>
              
              {getPlannedMealsForDate(selectedPlan).map((meal, index) => {
                const currentMealStatus = logData.meals.find(m => m.mealType === meal.mealType)?.status;
                const mealType = mealTypes.find(type => type.value === meal.mealType);
                
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
                      </div>
                    </div>
                    
                    {meal.instructions && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                        <strong>Instructions:</strong> {meal.instructions}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Daily Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-medium text-blue-900 mb-3">Daily Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Weight (lbs) - Optional
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={logData.weight || ''}
                      onChange={(e) => setLogData(prev => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : null }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client's weight"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Mood
                    </label>
                    <select
                      value={logData.mood || ''}
                      onChange={(e) => setLogData(prev => ({ ...prev, mood: e.target.value }))}
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
                      value={logData.energyLevel || ''}
                      onChange={(e) => setLogData(prev => ({ ...prev, energyLevel: e.target.value }))}
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
                      value={logData.notes || ''}
                      onChange={(e) => setLogData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="How did the client feel today? Any challenges or successes?"
                    />
                  </div>
                </div>

                {/* Calculated Stats */}
                <div className="mt-4 p-3 bg-blue-100 rounded">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Total Calories:</span>
                      <span className="ml-2 font-bold text-blue-900">{logData.totalConsumedCalories}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Adherence Score:</span>
                      <span className="ml-2 font-bold text-blue-900">{logData.adherenceScore}%</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Completed Meals:</span>
                      <span className="ml-2 font-bold text-blue-900">
                        {logData.meals.filter(m => m.status === 'completed').length}/{logData.meals.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveNutritionLog}
                  disabled={saving}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saving ? 'Creating Log...' : 'Create Nutrition Log'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerNutritionManager;
