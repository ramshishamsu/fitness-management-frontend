import { Link } from "react-router-dom";
import { CheckCircle, Users, Calendar, Dumbbell } from "lucide-react";

const UserPaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full mx-4">

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Your subscription is now active. Start your fitness journey today!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-green-800 mb-2">✅ Subscription Active</h3>
          <p className="text-green-700 text-sm">
            You now have full access to all premium features including personal trainers and custom workout plans.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/user/trainers"
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Users className="w-4 h-4 mr-2" />
            Choose Your Trainer
          </Link>

          <Link
            to="/user/my-workouts"
            className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            View Your Workouts
          </Link>

          <Link
            to="/user/appointments"
            className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointments
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/user/dashboard"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UserPaymentSuccess;
