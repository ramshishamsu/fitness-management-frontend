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
  Activity,
  Flame,
  Heart,
  Zap,
  Award,
  ChevronRight,
  Plus,
  MessageCircle,
  CheckCircle,
  Star
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    trainer: null,
    workouts: [],
    nutritionLogs: [],
    goals: [],
    progress: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data with Promise.allSettled for better error handling
      const [trainerRes, workoutsRes, nutritionRes, goalsRes, progressRes] = await Promise.allSettled([
        axios.get('/trainers/assigned-trainer').catch(() => ({ data: null })),
        axios.get('/users/workouts').catch(() => ({ data: [] })),
        axios.get('/users/nutrition-logs').catch(() => ({ data: [] })),
        axios.get('/users/goals').catch(() => ({ data: [] })),
        axios.get('/users/progress').catch(() => ({ data: [] }))
      ]);
      
      const trainer = trainerRes.value?.data;
      const workouts = Array.isArray(workoutsRes.value?.data) ? workoutsRes.value.data : [];
      const nutritionLogs = Array.isArray(nutritionRes.value?.data) ? nutritionRes.value.data : [];
      const goals = Array.isArray(goalsRes.value?.data) ? goalsRes.value.data : [];
      const progress = Array.isArray(progressRes.value?.data) ? progressRes.value.data : [];
      
      setDashboardData({ trainer, workouts, nutritionLogs, goals, progress });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId, newValue) => {
    try {
      await axios.post('/progress', { goalId, value: newValue, date: new Date() });
      setDashboardData(prev => ({
        ...prev,
        goals: prev.goals.map(goal => 
          goal._id === goalId ? { ...goal, currentValue: newValue } : goal
        )
      }));
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50"
      }`}>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className={`w-20 h-20 border-4 ${isDark ? 'border-teal-800' : 'border-teal-200'} rounded-full`}></div>
            <div className={`w-20 h-20 border-4 ${isDark ? 'border-teal-400' : 'border-teal-600'} rounded-full border-t-transparent animate-spin absolute top-0 left-0`}></div>
            <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
              <Dumbbell className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <p className={`font-medium text-lg ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>Loading Dashboard</p>
        </div>
      </div>
    );
  }

  const { trainer, workouts, nutritionLogs, goals, progress } = dashboardData;

  // Calculate correct stats
  const completedWorkouts = workouts.filter(w => w.completed).length;
  const todayCalories = nutritionLogs.reduce((sum, log) => {
    if (new Date(log.date).toDateString() === new Date().toDateString()) {
      return sum + (log.meals?.reduce((mealSum, meal) => mealSum + (meal.totalCalories || 0), 0) || 0);
    }
    return sum;
  }, 0);
  const activeGoals = goals.filter(g => g.status !== 'completed').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50"
    }`}>

      {/* ENHANCED HEADER */}
      <div className={`rounded-3xl shadow-2xl p-8 mb-8 border backdrop-blur-sm relative overflow-hidden ${
        isDark 
          ? "bg-slate-800/80 border-slate-700 text-white" 
          : "bg-white/80 border-teal-200 text-slate-900"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
                isDark 
                  ? "from-teal-400 to-cyan-400" 
                  : "from-teal-600 to-cyan-600"
              } bg-clip-text text-transparent mb-3`}>
                Welcome back, {user?.name || "User"} 💪
              </h1>
              <p className={`${isDark ? "text-slate-300" : "text-slate-600"} text-lg mb-4`}>Here's your fitness overview</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
                  isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                }`}>
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">{completedWorkouts}/{workouts.length} Workouts</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
                  isDark ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"
                }`}>
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{todayCalories} kcal today</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
                  isDark ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"
                }`}>
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">{activeGoals} active goals</span>
                </div>
              </div>
            </div>
            
            {trainer && (
              <div className={`flex flex-col items-center p-6 rounded-2xl border ${
                isDark 
                  ? "bg-teal-500/10 border-teal-400/30 text-teal-300" 
                  : "bg-teal-50 border-teal-200 text-teal-700"
              }`}>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <span className="text-lg font-bold">{trainer.name}</span>
                <span className="text-sm opacity-75">Your Trainer</span>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{trainer.rating || '4.8'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`group relative rounded-3xl shadow-2xl p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30 text-blue-300" 
            : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl ${isDark ? "bg-blue-500/20" : "bg-blue-500/10"} group-hover:scale-110 transition-transform duration-300`}>
                <Dumbbell className="w-8 h-8 text-blue-500" />
              </div>
              <Flame className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className={`text-4xl font-bold ${isDark ? "text-blue-300" : "text-blue-900"} mb-1`}>{workouts.length}</p>
              <p className={`text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}>Total Workouts</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="w-full bg-blue-200/30 rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full" style={{width: `${(completedWorkouts / Math.max(workouts.length, 1)) * 100}%`}}></div>
                </div>
                <span className="text-xs">{Math.round((completedWorkouts / Math.max(workouts.length, 1)) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`group relative rounded-3xl shadow-2xl p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-orange-600/20 to-amber-600/20 border-orange-500/30 text-orange-300" 
            : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 text-orange-900"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl ${isDark ? "bg-orange-500/20" : "bg-orange-500/10"} group-hover:scale-110 transition-transform duration-300`}>
                <Apple className="w-8 h-8 text-orange-500" />
              </div>
              <Heart className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className={`text-4xl font-bold ${isDark ? "text-orange-300" : "text-orange-900"} mb-1`}>{nutritionLogs.length}</p>
              <p className={`text-sm ${isDark ? "text-orange-400" : "text-orange-700"}`}>Nutrition Logs</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium">{todayCalories} kcal</span>
                <span className="text-xs opacity-75">today</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`group relative rounded-3xl shadow-2xl p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-purple-600/20 to-violet-600/20 border-purple-500/30 text-purple-300" 
            : "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 text-purple-900"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl ${isDark ? "bg-purple-500/20" : "bg-purple-500/10"} group-hover:scale-110 transition-transform duration-300`}>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className={`text-4xl font-bold ${isDark ? "text-purple-300" : "text-purple-900"} mb-1`}>{activeGoals}</p>
              <p className={`text-sm ${isDark ? "text-purple-400" : "text-purple-700"}`}>Active Goals</p>
              <div className="mt-2 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs">{completedGoals} completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`group relative rounded-3xl shadow-2xl p-6 border backdrop-blur-sm transform hover:scale-105 transition-all duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-emerald-500/30 text-emerald-300" 
            : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 text-emerald-900"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl ${isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"} group-hover:scale-110 transition-transform duration-300`}>
                <Activity className="w-8 h-8 text-emerald-500" />
              </div>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className={`text-4xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-900"} mb-1`}>{progress.length}</p>
              <p className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Progress Updates</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium">On track</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className={`group rounded-3xl shadow-2xl p-6 border backdrop-blur-sm hover:shadow-3xl transition-all duration-500 ${
          isDark 
            ? "bg-slate-800/80 border-slate-700" 
            : "bg-white/80 border-teal-200"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center ${isDark ? "text-white" : "text-slate-900"}`}>
              <div className={`p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 ${isDark ? "bg-green-500/20" : "bg-green-100"}`}>
                <MessageCircle className={`w-6 h-6 ${isDark ? "text-green-400" : "text-green-600"}`} />
              </div>
              Messages
            </h2>
            <Link to="/user/messages" className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark ? "text-green-400 hover:bg-green-500/20" : "text-green-600 hover:bg-green-50"}`}>
              Open Chat <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className={`text-center py-12 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            <div className={`p-6 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isDark ? "bg-slate-700" : "bg-green-100"}`}>
              <MessageCircle className={`w-10 h-10 ${isDark ? "text-slate-500" : "text-green-600"}`} />
            </div>
            <p className="text-lg font-medium mb-2">Chat with your trainer</p>
            {trainer ? (
              <div className="space-y-2">
                <p className="text-sm opacity-75">Connected with {trainer.name}</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Available
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm opacity-75">Book a trainer to start messaging</p>
                <button onClick={() => navigate('/user/trainers')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-green-100 text-green-600 hover:bg-green-200"}`}>
                  Find Trainers
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Workouts */}
        <div className={`group rounded-3xl shadow-2xl p-6 border backdrop-blur-sm hover:shadow-3xl transition-all duration-500 ${
          isDark 
            ? "bg-slate-800/80 border-slate-700" 
            : "bg-white/80 border-teal-200"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center ${isDark ? "text-white" : "text-slate-900"}`}>
              <div className={`p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                <Dumbbell className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              Recent Workouts
            </h2>
            <Link to="/user/my-workouts" className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark ? "text-blue-400 hover:bg-blue-500/20" : "text-blue-600 hover:bg-blue-50"}`}>
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.slice(0, 3).map((workout) => (
                <div key={workout._id} className={`group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:scale-102 ${isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-blue-50 hover:bg-blue-100"}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
                      <Dumbbell className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{workout.name}</p>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{workout.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${workout.completed ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700')}`}>
                      {workout.completed ? '✓ Done' : '○ Pending'}
                    </span>
                    {workout.completed && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className={`p-6 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center ${isDark ? "bg-slate-700" : "bg-blue-100"}`}>
                <Dumbbell className={`w-10 h-10 ${isDark ? "text-slate-500" : "text-blue-600"}`} />
              </div>
              <p className={`text-lg font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>No workouts yet</p>
              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"} mt-2 mb-4`}>Start your fitness journey!</p>
              <button onClick={() => navigate('/user/trainers')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}>
                Book a Trainer
              </button>
            </div>
          )}
        </div>

        {/* Goals */}
        <div className={`group rounded-3xl shadow-2xl p-6 border backdrop-blur-sm hover:shadow-3xl transition-all duration-500 ${
          isDark 
            ? "bg-slate-800/80 border-slate-700" 
            : "bg-white/80 border-teal-200"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center ${isDark ? "text-white" : "text-slate-900"}`}>
              <div className={`p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300 ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                <Target className={`w-6 h-6 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              Your Goals
            </h2>
            <div className="flex items-center space-x-2">
              <Link to="/user/goals" className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark ? "text-purple-400 hover:bg-purple-500/20" : "text-purple-600 hover:bg-purple-50"}`}>
                Manage <ChevronRight className="w-4 h-4" />
              </Link>
              <button onClick={() => navigate('/user/goals')} className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${isDark ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"}`}>
                <Plus className="w-4 h-4" /> New
              </button>
            </div>
          </div>
          
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const progressPercentage = goal.targetValue > 0 ? Math.min((goal.currentValue / goal.targetValue) * 100, 100) : 0;
                
                return (
                  <div key={goal._id} className={`group p-5 rounded-2xl transition-all duration-300 hover:scale-102 ${isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-purple-50 hover:bg-purple-100"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{goal.title}</h3>
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{goal.currentValue || 0} / {goal.targetValue} {goal.unit}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${progressPercentage >= 100 ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : progressPercentage >= 50 ? (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700') : (isDark ? 'bg-slate-600/20 text-slate-400' : 'bg-slate-200 text-slate-700')}`}>
                          {progressPercentage >= 100 ? '✓ Completed' : `${Math.round(progressPercentage)}%`}
                        </span>
                        {progressPercentage >= 100 && <Award className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className={`h-3 rounded-full transition-all duration-500 ${progressPercentage >= 100 ? 'bg-gradient-to-r from-emerald-500 to-green-500' : progressPercentage >= 50 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`} style={{width: `${progressPercentage}%`}}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{progressPercentage >= 100 ? '🎉 Goal achieved!' : `${Math.round(progressPercentage)}% Complete`}</p>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateGoalProgress(goal._id, (goal.currentValue || 0) - 1)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 hover:scale-110 ${isDark ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`} disabled={(goal.currentValue || 0) <= 0}>
                          -
                        </button>
                        <span className={`text-sm font-bold px-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{goal.currentValue || 0}</span>
                        <button onClick={() => updateGoalProgress(goal._id, (goal.currentValue || 0) + 1)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 hover:scale-110 ${isDark ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"}`}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className={`p-6 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center ${isDark ? "bg-slate-700" : "bg-purple-100"}`}>
                <Target className={`w-10 h-10 ${isDark ? "text-slate-500" : "text-purple-600"}`} />
              </div>
              <p className={`text-lg font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>No goals yet</p>
              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-500"} mt-2 mb-4`}>Set your fitness goals!</p>
              <button onClick={() => navigate('/user/goals')} className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" : "bg-purple-100 text-purple-600 hover:bg-purple-200"}`}>
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