import { useState, useEffect } from "react";
import { Calendar, Clock, TrendingUp, Activity, Dumbbell, Apple } from "lucide-react";
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
    <div className={`${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 🏋️‍♂️
          </h1>
          <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
            Manage your fitness training efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-lg`}>
            <div className={`w-12 h-12 mb-4 flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'} rounded-lg`}>
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Active Clients</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeClients}</p>
              <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>+2 this week</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-lg`}>
            <div className={`w-12 h-12 mb-4 flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/10 text-blue-600'} rounded-lg`}>
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Sessions This Week</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.sessionsThisWeek}</p>
              <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>+12% from last week</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-lg`}>
            <div className={`w-12 h-12 mb-4 flex items-center justify-center ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-500/10 text-green-600'} rounded-lg`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Monthly Earnings</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{stats.monthlyEarnings.toLocaleString()}</p>
              <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>+8% from last month</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-lg`}>
            <div className={`w-12 h-12 mb-4 flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-500/10 text-orange-600'} rounded-lg`}>
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Today's Sessions</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.todaySessions}</p>
              <p className={`text-sm ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{stats.todaySessions > 0 ? 'On track' : 'No sessions today'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6 shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.href = '/trainer/assign-workout'}
              className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-emerald-600 text-black hover:bg-emerald-500' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Dumbbell className="w-8 h-8 mb-3" />
              <span className="font-medium">Assign Workout</span>
            </button>

            <button
              onClick={() => window.location.href = '/trainer/nutrition'}
              className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-blue-600 text-white hover:bg-blue-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Apple className="w-8 h-8 mb-3" />
              <span className="font-medium">Nutrition Plans</span>
            </button>

            <button
              onClick={() => window.location.href = '/trainer/schedule'}
              className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-purple-600 text-white hover:bg-purple-500' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Calendar className="w-8 h-8 mb-3" />
              <span className="font-medium">Schedule</span>
            </button>

            <button
              onClick={() => window.location.href = '/trainer/profile'}
              className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-600 text-white hover:bg-gray-500' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <Activity className="w-8 h-8 mb-3" />
              <span className="font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
