import { useState, useEffect } from "react";
import { Calendar, Clock, TrendingUp, Activity, Dumbbell, Apple, IndianRupee } from "lucide-react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/ThemeContext.jsx";

const TrainerDashboard = () => {
  const { user, refreshUser } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    activeClients: 0,
    sessionsThisWeek: 0,
    monthlyEarnings: 0,
    todaySessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh user data to get updated status after admin approval
    if (refreshUser && typeof refreshUser === 'function') {
      refreshUser().catch(error => {
        console.error('Error refreshing user data:', error);
      });
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch clients count
      const clientsRes = await axiosInstance.get('/trainers/clients');
      
      // Fetch workouts assigned by this trainer
      const workoutsRes = await axiosInstance.get('/workouts/assigned');

      // Calculate stats
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const activeClients = clientsRes.data.length;
      const sessionsThisWeek = workoutsRes.data.filter(w => 
        new Date(w.createdAt) >= weekStart
      ).length;
      const todaySessions = workoutsRes.data.filter(w => 
        new Date(w.createdAt).toDateString() === new Date().toDateString()
      ).length;

      setStats({
        activeClients,
        sessionsThisWeek,
        monthlyEarnings: sessionsThisWeek * 500, // Assuming ₹500 per session
        todaySessions
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen p-4 sm:p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 🏋️‍♂️
          </h1>
          <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'} text-sm sm:text-base`}>
            Manage your fitness training efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 sm:p-6 shadow-lg`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 flex items-center justify-center ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-500/10 text-teal-600'} rounded-lg`}>
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Clients</p>
              <p className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeClients}</p>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>+2 this week</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 sm:p-6 shadow-lg`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 flex items-center justify-center ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-500/10 text-teal-600'} rounded-lg`}>
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sessions This Week</p>
              <p className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.sessionsThisWeek}</p>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>+12% from last week</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 sm:p-6 shadow-lg`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 flex items-center justify-center ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-500/10 text-teal-600'} rounded-lg`}>
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Earnings</p>
              <p className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{stats.monthlyEarnings.toLocaleString()}</p>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>+8% from last month</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 sm:p-6 shadow-lg`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 flex items-center justify-center ${isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-500/10 text-teal-600'} rounded-lg`}>
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Today's Sessions</p>
              <p className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.todaySessions}</p>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>{stats.todaySessions > 0 ? 'On track' : 'No sessions today'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 sm:p-6 shadow-lg`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <button
              onClick={() => window.location.href = '/trainer/assign-workout'}
              className={`flex flex-col items-center justify-center p-3 sm:p-6 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20' 
                  : 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20'
              }`}
            >
              <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
              <span className="text-xs sm:text-sm font-medium">Assign Workout</span>
            </button>

            <button
              onClick={() => window.location.href = '/trainer/nutrition'}
              className={`flex flex-col items-center justify-center p-3 sm:p-6 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20' 
                  : 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20'
              }`}
            >
              <Apple className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
              <span className="text-xs sm:text-sm font-medium">Nutrition Plans</span>
            </button>

            <button
              onClick={() => window.location.href = '/trainer/schedule'}
              className={`flex flex-col items-center justify-center p-3 sm:p-6 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20' 
                  : 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20'
              }`}
            >
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
              <span className="text-xs sm:text-sm font-medium">Schedule</span>
            </button>

            <button
              onClick={() => window.location.href = '/trainer/earnings'}
              className={`flex flex-col items-center justify-center p-3 sm:p-6 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20' 
                  : 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20'
              }`}
            >
              <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
              <span className="text-xs sm:text-sm font-medium">Earnings</span>
            </button>

            <button
              onClick={() => window.location.href = '/trainer/profile'}
              className={`flex flex-col items-center justify-center p-3 sm:p-6 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20' 
                  : 'bg-gray-600 text-white hover:bg-gray-700 shadow-gray-600/20'
              }`}
            >
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
              <span className="text-xs sm:text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
