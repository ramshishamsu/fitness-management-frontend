import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

import {
  Dumbbell,
  Apple,
  Target,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Flame,
  Heart,
  Zap,
  Award,
  BarChart3
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    trainer: null,
    workouts: [],
    payments: [],
    nutritionLogs: [],
    goals: [],
    progress: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch trainer assignment
      const trainerRes = await axios.get('/trainers/assigned-trainer');
      
      // Fetch user workouts
      const workoutsRes = await axios.get('/workouts/user');
      
      // Fetch user payments
      const paymentsRes = await axios.get('/payments/user');
      
      // Fetch nutrition logs
      const nutritionRes = await axios.get('/nutrition-plans/logs');
      
      // Fetch user goals
      const goalsRes = await axios.get('/goals/user');
      
      // Fetch progress data
      const progressRes = await axios.get('/progress/user');
      
      setDashboardData({
        trainer: trainerRes?.data || null,
        workouts: Array.isArray(workoutsRes?.data) ? workoutsRes.data : [],
        payments: Array.isArray(paymentsRes?.data) ? paymentsRes.data : [],
        nutritionLogs: nutritionRes?.data?.nutritionLogs || [],
        goals: Array.isArray(goalsRes?.data) ? goalsRes.data : [],
        progress: Array.isArray(progressRes?.data) ? progressRes.data : []
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

  const updateGoalProgress = async (goalId, newValue) => {
    try {
      // Update progress via API
      await axios.post('/progress', {
        goalId,
        value: newValue,
        date: new Date()
      });

      // Update local state
      setDashboardData(prev => ({
        ...prev,
        goals: prev.goals.map(goal => 
          goal._id === goalId ? { ...goal, currentValue: newValue } : goal
        )
      }));

      console.log('✅ Goal progress updated:', { goalId, newValue });
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50"
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`w-16 h-16 border-4 ${isDark ? 'border-teal-800' : 'border-teal-200'} rounded-full`}></div>
            <div className={`w-16 h-16 border-4 ${isDark ? 'border-teal-400' : 'border-teal-600'} rounded-full border-t-transparent animate-spin absolute top-0 left-0`}></div>
          </div>
          <div className="text-center">
            <p className={`font-medium ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>Loading Dashboard</p>
            <p className={`text-sm ${isDark ? 'text-teal-500' : 'text-teal-600'}`}>Preparing your fitness overview...</p>
          </div>
        </div>
      </div>
    );
  }

  const { trainer, workouts, payments, nutritionLogs, goals, progress } = dashboardData;

  return (
    <div className={`min-h-screen p-4 sm:p-6 overflow-hidden flex flex-col ${
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50"
    }`}>

      {/* HEADER */}
      <div className={`rounded-2xl shadow-lg p-6 mb-6 border backdrop-blur-sm ${
        isDark 
          ? "bg-slate-800/80 border-slate-700 text-white" 
          : "bg-white/80 border-teal-200 text-slate-900"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${
              isDark 
                ? "from-teal-400 to-cyan-400" 
                : "from-teal-600 to-cyan-600"
            } bg-clip-text text-transparent`}>
              Welcome back, {user?.name || "User"} 💪
            </h1>
            <p className={`${isDark ? "text-slate-300" : "text-slate-600"} mt-2 text-sm sm:text-base`}>Here's your fitness overview</p>
          </div>
          {trainer && (
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl border ${
              isDark 
                ? "bg-teal-500/10 border-teal-400/30 text-teal-300" 
                : "bg-teal-50 border-teal-200 text-teal-700"
            }`}>
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{trainer.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-2xl shadow-lg p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-300 ${
          isDark 
            ? "bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30 text-blue-300" 
            : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${
              isDark ? "bg-blue-500/20" : "bg-blue-500/10"
            }`}>
              <Dumbbell className="w-6 h-6 text-blue-500" />
            </div>
            <Flame className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className={`text-3xl font-bold ${isDark ? "text-blue-300" : "text-blue-900"}`}>{workouts.length}</p>
            <p className={`text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}>Workouts</p>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-300 ${
          isDark 
            ? "bg-gradient-to-br from-orange-600/20 to-amber-600/20 border-orange-500/30 text-orange-300" 
            : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 text-orange-900"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${
              isDark ? "bg-orange-500/20" : "bg-orange-500/10"
            }`}>
              <Apple className="w-6 h-6 text-orange-500" />
            </div>
            <Heart className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className={`text-3xl font-bold ${isDark ? "text-orange-300" : "text-orange-900"}`}>{nutritionLogs.length}</p>
            <p className={`text-sm ${isDark ? "text-orange-400" : "text-orange-700"}`}>Nutrition</p>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-300 ${
          isDark 
            ? "bg-gradient-to-br from-purple-600/20 to-violet-600/20 border-purple-500/30 text-purple-300" 
            : "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 text-purple-900"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${
              isDark ? "bg-purple-500/20" : "bg-purple-500/10"
            }`}>
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className={`text-3xl font-bold ${isDark ? "text-purple-300" : "text-purple-900"}`}>
              {goals.filter(g => g.status === 'active').length}
            </p>
            <p className={`text-sm ${isDark ? "text-purple-400" : "text-purple-700"}`}>Active Goals</p>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-300 ${
          isDark 
            ? "bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-emerald-500/30 text-emerald-300" 
            : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 text-emerald-900"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${
              isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
            }`}>
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className={`text-3xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-900"}`}>{progress.length}</p>
            <p className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Progress</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 overflow-y-auto">
        
        {/* WORKOUTS */}
        <div className={`rounded-2xl shadow-lg p-6 border backdrop-blur-sm ${
          isDark 
            ? "bg-slate-800/80 border-slate-700" 
            : "bg-white/80 border-teal-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold flex items-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <div className={`p-2 rounded-xl mr-3 ${
                isDark ? "bg-blue-500/20" : "bg-blue-100"
              }`}>
                <Dumbbell className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              Workouts
            </h2>
            <Link 
              to="/user/my-workouts" 
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                isDark 
                  ? "text-blue-400 hover:bg-blue-500/20" 
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              View All
            </Link>
          </div>
          
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.slice(0, 3).map((workout) => (
                <div key={workout._id} className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-102 ${
                  isDark 
                    ? "bg-slate-700/50 hover:bg-slate-700" 
                    : "bg-teal-50 hover:bg-teal-100"
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isDark ? "bg-blue-500/20" : "bg-blue-100"
                    }`}>
                      <Dumbbell className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{workout.name}</p>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{workout.category}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    workout.completed 
                      ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {workout.completed ? '✓ Done' : '○ Pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center ${
                isDark ? "bg-slate-700" : "bg-teal-100"
              }`}>
                <Dumbbell className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-teal-600"}`} />
              </div>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>No workouts yet</p>
              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"} mt-1`}>Start your fitness journey!</p>
            </div>
          )}
        </div>

        {/* NUTRITION */}
        <div className={`rounded-2xl shadow-lg p-6 border backdrop-blur-sm ${
          isDark 
            ? "bg-slate-800/80 border-slate-700" 
            : "bg-white/80 border-teal-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold flex items-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <div className={`p-2 rounded-xl mr-3 ${
                isDark ? "bg-orange-500/20" : "bg-orange-100"
              }`}>
                <Apple className={`w-5 h-5 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
              </div>
              Nutrition
            </h2>
            <Link 
              to="/user/nutrition-tracker" 
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                isDark 
                  ? "text-orange-400 hover:bg-orange-500/20" 
                  : "text-orange-600 hover:bg-orange-50"
              }`}
            >
              Track
            </Link>
          </div>
          
          {nutritionLogs.length > 0 ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${
                isDark ? "bg-slate-700/50" : "bg-orange-50"
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>Today's Summary</span>
                  <Heart className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-500"}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Calories</span>
                    <span className={`font-bold ${isDark ? "text-orange-300" : "text-orange-700"}`}>
                      {(() => {
                        const todayLog = nutritionLogs.find(log => 
                          new Date(log.date).toDateString() === new Date().toDateString()
                        );
                        return todayLog?.meals?.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0) || 0;
                      })()} kcal
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Protein</span>
                    <span className={`font-bold ${isDark ? "text-orange-300" : "text-orange-700"}`}>
                      {(() => {
                        const todayLog = nutritionLogs.find(log => 
                          new Date(log.date).toDateString() === new Date().toDateString()
                        );
                        return todayLog?.meals?.reduce((sum, meal) => sum + (meal.totalProtein || 0), 0) || 0;
                      })()}g
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Carbs</span>
                    <span className={`font-bold ${isDark ? "text-orange-300" : "text-orange-700"}`}>
                      {(() => {
                        const todayLog = nutritionLogs.find(log => 
                          new Date(log.date).toDateString() === new Date().toDateString()
                        );
                        return todayLog?.meals?.reduce((sum, meal) => sum + (meal.totalCarbs || 0), 0) || 0;
                      })()}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center ${
                isDark ? "bg-slate-700" : "bg-orange-100"
              }`}>
                <Apple className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-orange-600"}`} />
              </div>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>No nutrition data</p>
              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"} mt-1`}>Start tracking your meals!</p>
            </div>
          )}
        </div>

        {/* GOALS */}
        <div className={`rounded-2xl shadow-lg p-6 border backdrop-blur-sm ${
          isDark 
            ? "bg-slate-800/80 border-slate-700" 
            : "bg-white/80 border-teal-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold flex items-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              <div className={`p-2 rounded-xl mr-3 ${
                isDark ? "bg-purple-500/20" : "bg-purple-100"
              }`}>
                <Target className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              Goals
            </h2>
            <div className="flex items-center space-x-2">
              <Link 
                to="/user/goals" 
                className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                  isDark 
                    ? "text-purple-400 hover:bg-purple-500/20" 
                    : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                Manage
              </Link>
              <button
                onClick={() => navigate('/user/goals')}
                className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                  isDark 
                    ? "text-emerald-400 hover:bg-emerald-500/20" 
                    : "text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                + New
              </button>
            </div>
          </div>
          
          {goals.length > 0 ? (
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => {
                const progressPercentage = goal.targetValue > 0 
                  ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                  : 0;
                
                return (
                  <div key={goal._id} className={`p-4 rounded-xl transition-all hover:scale-102 ${
                    isDark 
                      ? "bg-slate-700/50 hover:bg-slate-700" 
                      : "bg-purple-50 hover:bg-purple-100"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{goal.title}</h3>
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          progressPercentage >= 100
                            ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                            : progressPercentage >= 50
                            ? isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                            : isDark ? 'bg-slate-600/20 text-slate-400' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {progressPercentage >= 100 ? '✓ Completed' : `${Math.round(progressPercentage)}%`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progressPercentage >= 100 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                              : progressPercentage >= 50
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick Progress Update */}
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {progressPercentage >= 100 ? 'Goal achieved! 🎉' : `${Math.round(progressPercentage)}% Complete`}
                      </p>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateGoalProgress(goal._id, (goal.currentValue || 0) - 1)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                            isDark 
                              ? "bg-slate-600 hover:bg-slate-500 text-white" 
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          disabled={(goal.currentValue || 0) <= 0}
                        >
                          -
                        </button>
                        <span className={`text-xs font-medium px-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {goal.currentValue || 0}
                        </span>
                        <button
                          onClick={() => updateGoalProgress(goal._id, (goal.currentValue || 0) + 1)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                            isDark 
                              ? "bg-purple-500 hover:bg-purple-600 text-white" 
                              : "bg-purple-500 hover:bg-purple-600 text-white"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center ${
                isDark ? "bg-slate-700" : "bg-purple-100"
              }`}>
                <Target className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-purple-600"}`} />
              </div>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>No goals yet</p>
              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"} mt-1`}>Set your fitness goals!</p>
              <button
                onClick={() => navigate('/user/goals')}
                className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark 
                    ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" 
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
