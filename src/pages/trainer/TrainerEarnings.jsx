import { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import Loader from "../../components/common/Loader";
import { getTrainerEarnings } from "../../api/trainerApi";

/*
|--------------------------------------------------------------------------
| TRAINER EARNINGS PAGE
|--------------------------------------------------------------------------
| Shows total released earnings for trainer
*/

const Earnings = () => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await getTrainerEarnings();
        setTotal(res.data.totalEarnings);
      } catch (error) {
        console.error("Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">My Earnings</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-8 rounded-xl shadow border max-w-md">
          <p className="text-gray-500">Total Earnings</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">
            ₹{total}
          </h2>
        </div>
      )}
    </Layout>
  );
};

export default Earnings;
