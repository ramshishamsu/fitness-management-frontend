import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const UserPaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
      <div className="bg-[#0B0F14] border border-[#1F2937] p-10 rounded-2xl text-center max-w-md">

        <CheckCircle size={72} className="text-[#00E676] mx-auto mb-4" />

        <h1 className="text-3xl font-bold mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-400 mb-6">
          Your subscription is now active.
          You can start workouts immediately 💪
        </p>

        <Link
          to="/user/dashboard"
          className="inline-block bg-[#00E676] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00C853]"
        >
          Go to Dashboard
        </Link>

      </div>
    </div>
  );
};

export default UserPaymentSuccess;
