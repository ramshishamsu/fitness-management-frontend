import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllTrainers,
  getAllPayments,
  getAllWithdrawals
} from "../../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [users, trainers, payments, withdrawals] = await Promise.all([
      getAllUsers(),
      getAllTrainers(),
      getAllPayments(),
      getAllWithdrawals()
    ]);

    setStats({
      users: users.data.length,
      trainers: trainers.data.length,
      payments: payments.data.length,
      withdrawals: withdrawals.data.length
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Stat title="Users" value={stats.users} />
      <Stat title="Trainers" value={stats.trainers} />
      <Stat title="Payments" value={stats.payments} />
      <Stat title="Withdrawals" value={stats.withdrawals} />
    </div>
  );
};

export default AdminDashboard;

const Stat = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);
