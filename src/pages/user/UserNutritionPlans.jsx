import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Target, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import axios from '../../api/axios';

const UserNutritionPlans = () => {
  const navigate = useNavigate();
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'completed':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'paused':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <Clock className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Nutrition Plans</h1>
          <p className="text-gray-600">View and track your nutrition plans created by trainers</p>
        </div>

        {/* Nutrition Plans Grid */}
        {nutritionPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nutritionPlans.map((plan, index) => (
              <div key={plan._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <span className={'px-3 py-1 rounded-full text-xs font-medium ' + getStatusColor(plan.status)}>
                      {plan.status?.charAt(0)?.toUpperCase() + plan.status?.slice(1)}
                    </span>
                  </div>

                  {/* Plan Description */}
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{plan.description}</p>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        {plan.duration} days • {getDaysRemaining(plan.endDate)} days remaining
                      </div>
                      <div className="text-gray-700">
                        {getGoalTypeLabel(plan.goals?.goalType)} • {plan.goals?.dailyCalories} cal/day
                      </div>
                      <div className="text-gray-700">
                        {plan.status}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Progress</span>
                    <div
                      className="w-full bg-gray-200 rounded-full h-2"
                      style={{
                        width: getProgressPercentage(plan.startDate, plan.endDate, plan.statistics?.completedDays, plan.duration) + '%'
                      }}
                    ></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate('/user/nutrition-log/' + plan._id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Nutrition Plans Yet</h3>
            <p className="text-gray-600 mb-6">
              You don't have any nutrition plans assigned by trainers yet.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Contact a trainer to create a personalized nutrition plan</p>
              <p>• Trainers can create comprehensive meal plans with daily tracking</p>
              <p>• Track your adherence and progress with detailed logging</p>
            </div>
          </div>
        )}

        {/* Create Plan Request */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need a Nutrition Plan?</h3>
            <p className="text-blue-700 mb-4">
              Connect with a certified trainer to get a personalized nutrition plan tailored to your goals.
            </p>
            <button
              onClick={() => navigate('/user/trainers')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Trainers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNutritionPlans;