import { useEffect, useState } from "react";
import { getMySubscription } from "../../api/subscriptionApi";
import Loader from "../../components/common/Loader";

/*
|--------------------------------------------------------------------------
| USER SUBSCRIPTION
|--------------------------------------------------------------------------
| - Shows active plan
*/

const UserSubscription = () => {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    getMySubscription().then(res => {
      setSubscription(res.data);
    });
  }, []);

  if (!subscription) return <Loader />;

  return (
    <div className="bg-[#111827] border border-gray-800 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">My Subscription</h2>

      <p><b>Plan:</b> {subscription.planId.name}</p>
      <p><b>Price:</b> ₹{subscription.planId.price}</p>
      <p><b>Status:</b> {subscription.status}</p>
      <p>
        <b>Valid Till:</b>{" "}
        {new Date(subscription.endDate).toDateString()}
      </p>
    </div>
  );
};

export default UserSubscription;
