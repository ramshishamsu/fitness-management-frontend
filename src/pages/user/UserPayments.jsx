import { useEffect, useState } from "react";
import { getMyPayments } from "../../api/paymentApi";
import Loader from "../../components/common/Loader";
import { getUserSubscription } from "../../api/userApi";

const UserPayments = () => {
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayments();
    loadSubscription(); // Fixed: changed from loadSubscriptions()
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getMyPayments();
      console.log("Payments response:", res.data);
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const loadSubscription = async () => {
  try {
    console.log("Token from localStorage:", localStorage.getItem("token"));
    const res = await getUserSubscription();
    
    // Extract subscription from profile data
    setSubscription(res.data.subscription);
  } catch (err) {
    console.error("Failed to load subscription:", err);
    console.error("Error status:", err.response?.status);
    console.error("Error message:", err.response?.data?.message);
    setError(err.response?.data?.message || "Failed to load subscription");
  } finally {
    setSubscriptionLoading(false);
  }
};

  if (loading || subscriptionLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Subscription Status Section - Moved inside return */}
      {subscription && subscription.status === 'active' && (
  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 mb-8 shadow-xl text-white relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
    
    <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Premium Active</h3>
            <p className="text-green-100 text-sm">Full access to all features</p>
          </div>
        </div>
        
        {/* Days Remaining Badge */}
        <div className="text-center">
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <p className="text-3xl font-bold">
              {subscription.endDate ? 
                Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
                '0'}
            </p>
            <p className="text-xs text-green-100">days left</p>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <p className="text-green-100 text-sm mb-1">Current Plan</p>
          <p className="text-xl font-semibold capitalize">
            {subscription.plan?.name || 'Premium Plan'}
          </p>
          <p className="text-green-100 text-sm">
            {subscription.plan?.duration ? `${subscription.plan.duration} days` : '90 days'}
          </p>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <p className="text-green-100 text-sm mb-1">Plan Price</p>
          <p className="text-xl font-semibold">
            ₹{subscription.plan?.price || '999'}
          </p>
          <p className="text-green-100 text-sm">one-time payment</p>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <p className="text-green-100 text-sm mb-1">Valid Until</p>
          <p className="text-xl font-semibold">
            {subscription.endDate ? 
              new Date(subscription.endDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }) : 
              'N/A'}
          </p>
          <p className="text-green-100 text-sm">
            {subscription.startDate ? 
              `Started ${new Date(subscription.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 
              ''}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 flex justify-center">
        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 shadow-lg">
          Manage Subscription
        </button>
      </div>
    </div>
  </div>
)}

      {subscription && subscription.status === 'expired' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ Subscription Expired
          </h3>
          <p className="text-red-700">
            Your subscription expired on {subscription.endDate ?
              new Date(subscription.endDate).toLocaleDateString() :
              'N/A'}
          </p>
          <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Renew Subscription
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-white">
        My Payments
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {payments.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No payments found.
        </div>
      )}

      {payments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-neutral-900 text-neutral-300">
              <tr>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    ₹{p.amount}
                  </td>

                  <td className="p-4 capitalize">
                    {p.paymentStatus || "success"}
                  </td>

                  <td className="p-4 uppercase">
                    {p.paymentMethod || "N/A"}
                  </td>

                  <td className="p-4">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPayments;