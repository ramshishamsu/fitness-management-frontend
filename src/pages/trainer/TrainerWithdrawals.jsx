import { useState } from "react";
import Layout from "../../components/common/Layout";
import { requestWithdrawal } from "../../api/trainerApi";

/*
|--------------------------------------------------------------------------
| TRAINER WITHDRAWAL REQUEST PAGE
|--------------------------------------------------------------------------
| Trainer submits withdrawal request
| Admin approval required
*/

const Withdrawals = () => {
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await requestWithdrawal(amount);
      setSuccess("Withdrawal request submitted successfully ✅");
      setAmount("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to request withdrawal"
      );
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">
        Request Withdrawal
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow border max-w-md"
      >
        <label className="block mb-2 text-sm font-medium">
          Amount
        </label>

        <input
          type="number"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Submit Request
        </button>
      </form>
    </Layout>
  );
};

export default Withdrawals;
