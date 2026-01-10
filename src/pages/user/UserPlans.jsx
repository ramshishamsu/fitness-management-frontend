import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";

/*
|--------------------------------------------------------------------------
| USER PLANS PAGE
|--------------------------------------------------------------------------
| - Shows plans created by admin
| - Dark + neon green theme (cult.fit style)
*/

const UserPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      const { data } = await API.get("/plans");
      setPlans(data);
    } catch (error) {
      console.error("Failed to load plans", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">
        Choose Your Plan
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <PlanCard key={plan._id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default UserPlans;

/* ===============================
   PLAN CARD (DARK + GREEN)
================================ */

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-[#0B0F14]
        border border-[#1F2937]
        p-8
        rounded-2xl
        text-white
        hover:border-[#00E676]
        transition
      "
    >
      <h2 className="text-xl font-semibold">{plan.name}</h2>

      <p className="text-4xl font-extrabold mt-3 text-[#00E676]">
        ₹{plan.price}
      </p>

      <p className="text-gray-400 mt-1">
        {plan.duration} months
      </p>

      <ul className="text-sm text-gray-400 mt-5 space-y-2">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-[#00E676]">✔</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        className="
          mt-8 w-full
          bg-[#00E676]
          text-black
          font-semibold
          py-3
          rounded-lg
          hover:bg-[#00C853]
          transition
        "
        onClick={() => navigate(`/user/checkout/${plan._id}`)}
      >
        Choose Plan
      </button>
    </div>
  );
};
