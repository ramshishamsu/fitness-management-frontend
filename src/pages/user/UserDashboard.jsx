import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Dumbbell,
  Apple,
  Target,
  Users,
  Calendar,
  TrendingUp,
  Activity
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    trainer: null,
    workouts: [],
    payments: [],
    nutritionLogs: [],
    goals: [],
    progress: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        trainerRes,
        workoutsRes,
        paymentsRes,
        nutritionRes,
        goalsRes,
        progressRes
      ] = await Promise.all([
        axios.get('/workouts/my').catch(() => ({ data: [] })),
        axios.get('/payments').catch(() => ({ data: [] })),
        axios.get('/nutrition-plans/logs').catch(() => ({ data: { nutritionLogs: [] } })),
        axios.get('/goals').catch(() => ({ data: { goals: [] } })),
        axios.get('/progress').catch(() => ({ data: [] }))
      ]);

      setDashboardData({
        trainer: trainerRes?.data || null,
        workouts: workoutsRes?.data || [],
        payments: paymentsRes?.data || [],
        nutritionLogs: nutritionRes?.data?.nutritionLogs || [],
        goals: goalsRes?.data?.goals || [],
        progress: progressRes?.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default empty data to prevent blank page
      setDashboardData({
        trainer: null,
        workouts: [],
        payments: [],
        nutritionLogs: [],
        goals: [],
        progress: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { trainer, workouts, payments, nutritionLogs, goals, progress } = dashboardData;

  return (
    <div className="h-screen bg-gray-50 p-6 overflow-hidden">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.name || "User"} 👋
            </h1>
            <p className="text-gray-600 mt-1">Here's your fitness overview</p>
          </div>
          {trainer && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Trainer: {trainer.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Dumbbell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Workouts</p>
              <p className="text-lg font-semibold text-gray-900">{workouts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Apple className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nutrition</p>
              <p className="text-lg font-semibold text-gray-900">{nutritionLogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Goals</p>
              <p className="text-lg font-semibold text-gray-900">
                {goals.filter(g => g.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold text-gray-900">{progress.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-3 gap-6 h-96">
        
        {/* WORKOUTS */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Dumbbell className="w-4 h-4 mr-2 text-blue-600" />
              Workouts
            </h2>
            <Link 
              to="/user/my-workouts" 
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              View All
            </Link>
          </div>
          
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.slice(0, 3).map((workout) => (
                <div key={workout._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{workout.name}</p>
                    <p className="text-xs text-gray-500">{workout.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    workout.completed 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {workout.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No workouts yet</p>
            </div>
          )}
        </div>

        {/* NUTRITION */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Apple className="w-4 h-4 mr-2 text-orange-600" />
              Nutrition
            </h2>
            <Link 
              to="/user/nutrition-tracker" 
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Track
            </Link>
          </div>
          
          {nutritionLogs.length > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Calories</span>
                <span className="font-medium">
                  {(() => {
                    const todayLog = nutritionLogs.find(log => 
                      new Date(log.date).toDateString() === new Date().toDateString()
                    );
                    return todayLog?.meals?.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0) || 0;
                  })()} kcal
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Protein</span>
                <span className="font-medium">
                  {(() => {
                    const todayLog = nutritionLogs.find(log => 
                      new Date(log.date).toDateString() === new Date().toDateString()
                    );
                    return todayLog?.meals?.reduce((sum, meal) => sum + (meal.totalProtein || 0), 0) || 0;
                  })()}g
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Carbs</span>
                <span className="font-medium">
                  {(() => {
                    const todayLog = nutritionLogs.find(log => 
                      new Date(log.date).toDateString() === new Date().toDateString()
                    );
                    return todayLog?.meals?.reduce((sum, meal) => sum + (meal.totalCarbs || 0), 0) || 0;
                  })()}g
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Apple className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No nutrition data</p>
            </div>
          )}
        </div>

        {/* GOALS */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-4 h-4 mr-2 text-purple-600" />
              Goals
            </h2>
            <Link 
              to="/user/goals" 
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Manage
            </Link>
          </div>
          
          {goals.length > 0 ? (
            <div className="space-y-3">
              {goals.slice(0, 2).map((goal) => (
                <div key={goal._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      goal.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  {goal.target && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No goals set</p>
            </div>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Link 
                to="/user/trainers" 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                <span>Find Trainer</span>
              </Link>
              
              <Link 
                to="/user/appointments" 
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Session</span>
              </Link>
              
              <Link 
                to="/user/nutrition-tracker" 
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <Apple className="w-4 h-4" />
                <span>Log Meal</span>
              </Link>
              
              <Link 
                to="/user/profile" 
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
