import { Link } from "react-router-dom";
import { CheckCircle, Home, Users, Calendar, Dumbbell, Apple, Target, CreditCard } from "lucide-react";

const UserPaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl w-full mx-4">

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-600 mb-8">
          Your subscription is now active! Your fitness journey begins with a comprehensive dashboard showing your trainer assignments, workouts, nutrition tracking, goals, appointments, and payment history.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-4">✅ What's Included in Your Dashboard:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-green-700 text-sm">Trainer Assignment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-purple-600" />
              <span className="text-green-700 text-sm">Personalized Workouts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Apple className="w-5 h-5 text-orange-600" />
              <span className="text-green-700 text-sm">Nutrition Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-pink-600" />
              <span className="text-green-700 text-sm">Goal Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-green-700 text-sm">Appointment Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span className="text-green-700 text-sm">Payment History</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/user/dashboard"
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Your Dashboard
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/user/trainers"
              className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              <Users className="w-4 h-4 mr-2" />
              Find Trainer
            </Link>

            <Link
              to="/user/appointments"
              className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at support@fitness.com
          </p>
        </div>

      </div>
    </div>
  );
};

export default UserPaymentSuccess;
