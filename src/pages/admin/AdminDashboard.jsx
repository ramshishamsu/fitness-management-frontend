import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Dumbbell, Calendar, DollarSign, TrendingUp, UserCheck, AlertTriangle, FileText, Settings } from 'lucide-react';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your fitness management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Link
              to="/admin/settings"
              className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 mb-4">
                Manage all users, trainers, and their permissions. Block/unblock users as needed.
              </p>
              <Link
                to="/admin/users"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                <span className="text-blue-700 font-medium">Manage Users</span>
                <Users className="text-blue-500" />
              </Link>
              <Link
                to="/admin/trainers"
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="text-purple-700 font-medium">Trainer Approvals</span>
                {stats.pendingTrainers > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingTrainers}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Management</h3>
            <div className="space-y-3">
              <Link
                to="/admin/payments"
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-green-700 font-medium">Payments</span>
                <DollarSign className="text-green-500" />
              </Link>
              <Link
                to="/admin/withdrawals"
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <span className="text-red-700 font-medium">Withdrawal Requests</span>
                {stats.pendingWithdrawals > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingWithdrawals}
                  </span>
                )}
              </Link>
              <Link
                to="/admin/plans"
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <span className="text-orange-700 font-medium">Manage Plans</span>
                <FileText className="text-orange-500" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations</h3>
            <div className="space-y-3">
              <Link
                to="/admin/appointments"
                className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <span className="text-indigo-700 font-medium">Appointments</span>
                <Calendar className="text-indigo-500" />
              </Link>
              <Link
                to="/admin/assign-plan"
                className="flex items-center justify-between p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <span className="text-teal-700 font-medium">Assign Plan</span>
                <UserCheck className="text-teal-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">System Status</span>
              <span className="text-green-600">● Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Database</span>
              <span className="text-blue-600">● Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium">Last Backup</span>
              <span className="text-purple-600">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-2 bg-green-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">New user registration</span>
            </div>
            <div className="flex items-center p-2 bg-yellow-50 rounded">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Payment processing delay reported</span>
            </div>
            <div className="flex items-center p-2 bg-blue-50 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">System update completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
