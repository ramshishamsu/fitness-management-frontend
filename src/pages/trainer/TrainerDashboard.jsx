import { useState, useEffect } from "react";
import { Users, Calendar, IndianRupee, Clock, Apple, TrendingUp, Activity } from "lucide-react";
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
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
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
      // Fetch clients
      const clientsRes = await axiosInstance.get('/trainers/clients');
      setClients(clientsRes.data);

      // Fetch workouts assigned by this trainer
      const workoutsRes = await axiosInstance.get('/workouts/assigned');
      setWorkouts(workoutsRes.data);

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
    <div className={`${isDark ? 'bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen px-6 py-10`}>
      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto mb-10">
        <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 🏋️‍♂️
            </h1>
            <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
              Manage your clients and track their progress efficiently
            </p>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-4 mb-14">
        <StatCard
          icon={<Users />}
          label="Active Clients"
          value={stats.activeClients}
          change="+2 this week"
          isDark={isDark}
        />
        <StatCard
          icon={<Calendar />}
          label="Sessions This Week"
          value={stats.sessionsThisWeek}
          change="+12% from last week"
          isDark={isDark}
        />
        <StatCard
          icon={<IndianRupee />}
          label="Monthly Earnings"
          value={`₹${stats.monthlyEarnings.toLocaleString()}`}
          change="+8% from last month"
          isDark={isDark}
        />
        <StatCard
          icon={<Clock />}
          label="Today's Sessions"
          value={stats.todaySessions}
          change={stats.todaySessions > 0 ? "On track" : "No sessions today"}
          isDark={isDark}
        />
      </div>

      {/* ================= TODAY'S ACTIVITY ================= */}
      <div className="max-w-7xl mx-auto mb-14">
        <h2 className="text-xl font-semibold mb-6">
          Today's Activity
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Workouts Assigned */}
          <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6`}>
            <h3 className={`text-lg font-medium mb-4 flex items-center gap-2`}>
              <Activity className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              Recent Workouts Assigned
            </h3>
            <div className="space-y-3">
              {workouts.slice(0, 5).map((workout) => (
                <div key={workout._id} className={`flex justify-between items-center p-3 ${isDark ? 'bg-neutral-800' : 'bg-gray-100'} rounded-lg`}>
                  <div>
                    <p className="font-medium">{workout.title}</p>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      {clients.find(c => c._id === workout.user)?.name || 'Unknown Client'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {workout.completed ? 'Completed' : 'Pending'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {workouts.length === 0 && (
                <p className={`${isDark ? 'text-neutral-400' : 'text-gray-500'} text-center py-4`}>No workouts assigned yet</p>
              )}
            </div>
          </div>

          {/* Nutrition Plans Created */}
          <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6`}>
            <h3 className={`text-lg font-medium mb-4 flex items-center gap-2`}>
              <Apple className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              Nutrition Management
            </h3>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client) => (
                <div key={client._id} className={`flex justify-between items-center p-3 ${isDark ? 'bg-neutral-800' : 'bg-gray-100'} rounded-lg`}>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>{client.email}</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/trainer/nutrition`}
                    className={`px-3 py-1 ${isDark ? 'bg-emerald-500 text-black' : 'bg-emerald-600 text-white'} text-sm rounded hover:${isDark ? 'bg-emerald-400' : 'bg-emerald-700'} transition`}
                  >
                    Manage Plan
                  </button>
                </div>
              ))}
              {clients.length === 0 && (
                <p className={`${isDark ? 'text-neutral-400' : 'text-gray-500'} text-center py-4`}>No clients assigned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CLIENTS ================= */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Your Clients
          </h2>
          <button 
            onClick={() => window.location.href = '/trainer/nutrition'}
            className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-medium hover:bg-emerald-400 transition flex items-center gap-2"
          >
            <Apple className="w-4 h-4" />
            Manage Nutrition
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard 
              key={client._id} 
              client={client}
              workoutCount={workouts.filter(w => w.user === client._id).length}
            />
          ))}
          {clients.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <Users className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg mb-2">No clients assigned yet</p>
              <p className="text-neutral-500">Start assigning workouts to build your client base</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ icon, label, value, change, isDark }) => (
  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6`}>
    <div className={`w-12 h-12 mb-4 flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-600'} rounded-lg`}>
      {icon}
    </div>
    <div className="text-center">
      <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>{label}</p>
      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{change}</p>
    </div>
  </div>
);

const ClientCard = ({ client, workoutCount, isDark }) => (
  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} rounded-xl p-6`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center`}>
          <Users className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.name}</h3>
          <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>{client.email}</p>
        </div>
      </div>
      <span className={`px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full`}>
        Active
      </span>
    </div>
    <p className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.name}</p>
    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'} mb-4`}>{client.email}</p>
    
    <div className="flex justify-between items-center mb-4">
      <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>Workouts Assigned</span>
      <span className="text-sm font-medium">{workoutCount}</span>
    </div>

    <div className="space-y-2">
      <button 
        onClick={() => window.location.href = `/trainer/assign-workout`}
        className={`w-full ${isDark ? 'bg-emerald-500 text-black' : 'bg-emerald-600 text-white'} py-2 rounded-md font-semibold hover:${isDark ? 'bg-emerald-400' : 'bg-emerald-700'} transition`}
      >
        Assign Workout
      </button>
      <button 
        onClick={() => window.location.href = `/trainer/nutrition`}
        className={`w-full border ${isDark ? 'border-emerald-500 text-emerald-400' : 'border-emerald-600 text-emerald-600'} py-2 rounded-md font-semibold hover:${isDark ? 'bg-emerald-500/10' : 'bg-emerald-700'} transition`}
      >
        Nutrition Plan
      </button>
    </div>
  </div>
);

export default TrainerDashboard;
