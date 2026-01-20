import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Dumbbell, Calendar, DollarSign, UserCheck, AlertTriangle, FileText } from 'lucide-react';
import axios from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    pendingTrainers: 0,
    appointments: 0,
    payments: 0,
    pendingWithdrawals: 0,
    plans: 0,
    activeUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <Link to={link || '#'} className="block">
      <div className={`${color} rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
          </div>
          <Icon className="w-8 h-8 text-white/60" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your fitness management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-600"
            link="/admin/users"
          />
          <StatCard
            title="Total Trainers"
            value={stats.totalTrainers}
            icon={Dumbbell}
            color="bg-purple-600"
            link="/admin/trainers"
          />
          <StatCard
            title="Pending Trainers"
            value={stats.pendingTrainers}
            icon={AlertTriangle}
            color="bg-yellow-600"
            link="/admin/trainers?status=pending"
          />
          <StatCard
            title="Appointments"
            value={stats.appointments}
            icon={Calendar}
            color="bg-green-600"
            link="/admin/appointments"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Payments"
            value={stats.payments}
            icon={DollarSign}
            color="bg-indigo-600"
            link="/admin/payments"
          />
          <StatCard
            title="Pending Withdrawals"
            value={stats.pendingWithdrawals}
            icon={AlertTriangle}
            color="bg-red-600"
            link="/admin/withdrawals"
          />
          <StatCard
            title="Active Plans"
            value={stats.plans}
            icon={FileText}
            color="bg-teal-600"
            link="/admin/plans"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={UserCheck}
            color="bg-orange-600"
            link="/admin/users?status=active"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Manage Users
            </Link>
            <Link
              to="/admin/trainers"
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Dumbbell className="w-5 h-5 mr-2" />
              Manage Trainers
            </Link>
            <Link
              to="/admin/payments"
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              View Payments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
