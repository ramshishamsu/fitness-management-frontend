import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Calendar,
  CreditCard,
  Dumbbell,
  Apple,
  Target,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
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
      
      // Fetch all data in parallel
      const [
        trainerRes,
        workoutsRes,
        paymentsRes,
        nutritionRes,
        goalsRes,
        progressRes
      ] = await Promise.all([
        axios.get('/workouts/my'),
        axios.get('/payments'),
        axios.get('/nutrition/logs'),
        axios.get('/goals'),
        axios.get('/progress')
      ]);

      setDashboardData({
        trainer: trainerRes?.data || null,
        workouts: workoutsRes?.data || [],
        payments: paymentsRes?.data || [],
        nutritionLogs: nutritionRes?.data || [],
        goals: goalsRes?.data?.goals || [],
        progress: progressRes?.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { trainer, workouts, appointments, payments, nutritionLogs, goals, progress } = dashboardData;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Your fitness journey is in full swing!
        </p>
        {trainer && (
          <div className="mt-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Your Trainer: {trainer.name}</span>
          </div>
        )}
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{workouts.length}</p>
            </div>
            <Dumbbell className="w-8 h-8 text-blue-600" />
          </div>
        </div>

  
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nutrition Logs</p>
              <p className="text-2xl font-bold text-gray-900">{nutritionLogs.length}</p>
            </div>
            <Apple className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter(g => g.status === 'active').length}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - Workouts & Trainer */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ASSIGNED WORKOUTS */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-blue-600" />
                Your Workouts
              </h2>
              <Link 
                to="/user/my-workouts" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.slice(0, 3).map((workout) => (
                  <div key={workout._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{workout.name}</h3>
                        <p className="text-sm text-gray-500">{workout.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {workout.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {workout.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No workouts assigned yet</p>
                <p className="text-sm text-gray-400">Your trainer will assign workouts soon</p>
              </div>
            )}
          </div>

          {/* UPCOMING APPOINTMENTS */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Appointments
              </h2>
              <Link 
                to="/user/appointments" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.slice(0, 3).map((workout) => (
                  <div key={workout._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {workout.title || 'Workout Session'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Trainer: {workout.trainer?.userId?.name || 'Not assigned'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        workout.completed 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {workout.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No appointments scheduled</p>
                <Link 
                  to="/user/appointments" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Book an Appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Nutrition, Goals, Progress */}
        <div className="space-y-6">
          
          {/* NUTRITION */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Apple className="w-5 h-5 mr-2 text-orange-600" />
                Nutrition
              </h2>
              <Link 
                to="/user/nutrition-tracker" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Track
              </Link>
            </div>
            
            {nutritionLogs.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Today's Calories</span>
                  <span className="font-medium">
                    {nutritionLogs.slice(-1)[0]?.calories || 0} kcal
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">
                    {nutritionLogs.slice(-1)[0]?.protein || 0}g
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Apple className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No nutrition logs yet</p>
              </div>
            )}
          </div>

          {/* GOALS */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Goals
              </h2>
              <Link 
                to="/user/goals" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Manage
              </Link>
            </div>
            
            {goals.length > 0 ? (
              <div className="space-y-2">
                {goals.slice(0, 2).map((goal) => (
                  <div key={goal._id} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{goal.title}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goal.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    {goal.target && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No goals set yet</p>
              </div>
            )}
          </div>

          {/* PAYMENTS */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payments
              </h2>
              <Link 
                to="/user/payments" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                History
              </Link>
            </div>
            
            {payments.length > 0 ? (
              <div className="space-y-2">
                {payments.slice(0, 2).map((payment) => (
                  <div key={payment._id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Payment</span>
                      <span className="font-medium">₹{payment.amount}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No payment history</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/user/trainers" 
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Find Trainer</span>
          </Link>
          
          <Link 
            to="/user/appointments" 
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Book Session</span>
          </Link>
          
          <Link 
            to="/user/nutrition-tracker" 
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Apple className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Log Meal</span>
          </Link>
          
          <Link 
            to="/user/profile" 
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
