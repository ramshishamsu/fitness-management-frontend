import { Link } from "react-router-dom";
import { XCircle, RefreshCw } from "lucide-react";

const UserPaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full mx-4">

        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Payment Not Completed</h3>
          <p className="text-yellow-700 text-sm">
            Your subscription was not activated. You can try purchasing again anytime.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/user/plans"
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Link>

          <Link
            to="/user/dashboard"
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UserPaymentCancel;
