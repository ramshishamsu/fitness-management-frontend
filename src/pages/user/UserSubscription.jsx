import { useEffect, useState } from "react";
import UserLayout from "../../components/common/UserLayout";
import { getMySubscription } from "../../api/subscriptionApi";
import Loader from "../../components/common/Loader";
import { CheckCircle, Clock, Calendar, CreditCard } from "lucide-react";

const UserSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const res = await getMySubscription();
      setSubscription(res.data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </UserLayout>
    );
  }

  if (!subscription) {
    return (
      <UserLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">No active subscription found.</p>
        </div>
      </UserLayout>
    );
  }

  const isActive = subscription.status === 'active';
  const isExpired = new Date() > new Date(subscription.endDate);

  return (
    <UserLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Subscription</h1>
          <p className="text-gray-600">Manage your fitness subscription</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`p-6 ${isActive ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50 border-l-4 border-gray-400'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {subscription.planId?.name || 'Subscription Plan'}
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
                    <p className="font-semibold text-gray-900">₹{subscription.planId?.price || 0}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {subscription.planId?.duration >= 30 
                        ? `${subscription.planId.duration/30} month${subscription.planId.duration > 30 ? 's' : ''}`
                        : `${subscription.planId.duration} days`
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

            {isActive && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Your subscription is active! You have full access to trainers, workouts, and all premium features.
                  </p>
                </div>
              </div>
            )}

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
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSubscription;
