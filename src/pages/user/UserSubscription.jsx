import { useEffect, useState } from "react";
import { getMySubscription } from "../../api/subscriptionApi";
import Loader from "../../components/common/Loader";
import { CheckCircle, Clock, Calendar, CreditCard } from "lucide-react";

const UserSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const res = await getMySubscription();
      console.log('✅ Subscription response:', res.data);
      setSubscription(res.data);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadSubscription}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No active subscription found.</p>
        <a 
          href="/user/plans" 
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Plans
        </a>
      </div>
    );
  }

  const isActive = subscription.status === 'active';
  const isExpired = new Date() > new Date(subscription.endDate);
  
  // Debug logging
  console.log('🔍 Subscription data:', subscription);
  console.log('🔍 Plan data:', subscription.planId);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Subscription</h1>
        <p className="text-gray-600">Manage your fitness subscription</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`p-6 ${isActive ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50 border-l-4 border-gray-400'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {subscription.planId?.name || subscription.planName || 'Subscription Plan'}
            </h2>
            <div className="flex items-center">
              {isActive ? (
                <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </span>
              ) : (
                <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {isExpired ? 'Expired' : 'Inactive'}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold text-gray-900">
                    ₹{subscription.planId?.price || subscription.amount || 0}
                    {subscription.planId?.duration && `/ ${subscription.planId.duration} days`}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {subscription.planId?.duration 
                      ? subscription.planId.duration >= 30 
                        ? `${subscription.planId.duration/30} month${subscription.planId.duration > 30 ? 's' : ''}`
                        : `${subscription.planId.duration} days`
                      : '30 days'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(subscription.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isActive && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-yellow-100 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">
              {isExpired 
                ? '⚠️ Your subscription has expired. Renew your plan to continue accessing premium features.'
                : '⚠️ Your subscription is not active. Please contact support or purchase a new plan.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSubscription;
