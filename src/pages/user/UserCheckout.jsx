import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { createCheckoutSession } from "../../api/paymentApi";
import Loader from "../../components/common/Loader";

const UserCheckout = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    API.get(`/plans/${planId}`).then(res => {
      setPlan(res.data);
    });
  }, [planId]);

  const handlePayment = async () => {
    try {
      // 🔥 IMPORTANT FIX
      const res = await createCheckoutSession({ planId });

      // 🔥 Redirect to Stripe hosted checkout
      window.location.href = res.data.url;

    } catch (error) {
      console.error(error);
      alert("Payment failed ❌");
    }
  };

  if (!plan) return <Loader />;

  return (
    <div className="max-w-md bg-[#111827] border border-gray-800 p-6 rounded-xl text-white">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      <p><b>Plan:</b> {plan.name}</p>
      <p><b>Price:</b> ₹{plan.price}</p>
      <p><b>Duration:</b> {plan.duration} months</p>

      <button
        className="mt-6 w-full bg-[#00E676] text-black font-semibold py-3 rounded"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default UserCheckout;
