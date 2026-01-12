import React, { useState, useEffect } from 'react';
import { Users, Dumbbell, Calendar, DollarSign, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
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
    totalRevenue: 0,
    monthlyRevenue: []
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
      if (error.response?.status === 401) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        // Redirect to home if not admin
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className={`${color} rounded-lg shadow-md p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold">{value.toLocaleString()}</p>
          {trend && (
            <p className="text-white/70 text-xs mt-1">
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className="text-white/50">
          {icon}
        </div>
      </div>
    </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your fitness platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="h-8 w-8" />}
            color="bg-blue-600"
            trend={stats.activeUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100) - 100 : 0}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<Activity className="h-8 w-8" />}
            color="bg-green-600"
          />
          <StatCard
            title="Total Trainers"
            value={stats.totalTrainers}
            icon={<Dumbbell className="h-8 w-8" />}
            color="bg-purple-600"
          />
          <StatCard
            title="Pending Trainers"
            value={stats.pendingTrainers}
            icon={<AlertTriangle className="h-8 w-8" />}
            color="bg-yellow-600"
          />
          <StatCard
            title="Total Appointments"
            value={stats.appointments}
            icon={<Calendar className="h-8 w-8" />}
            color="bg-indigo-600"
          />
          <StatCard
            title="Total Payments"
            value={stats.payments}
            icon={<DollarSign className="h-8 w-8" />}
            color="bg-green-600"
          />
          <StatCard
            title="Pending Withdrawals"
            value={stats.pendingWithdrawals}
            icon={<AlertTriangle className="h-8 w-8" />}
            color="bg-red-600"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp className="h-8 w-8" />}
            color="bg-emerald-600"
          />
          <StatCard
            title="Total Plans"
            value={stats.plans}
            icon={<Dumbbell className="h-8 w-8" />}
            color="bg-orange-600"
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Revenue Trend</h2>
          <div className="h-64">
            {stats.monthlyRevenue.length > 0 ? (
              <div className="flex items-end justify-between h-full">
                {stats.monthlyRevenue.map((month, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 w-full rounded-t"
                      style={{ height: `${(month.total / Math.max(...stats.monthlyRevenue.map(m => m.total))) * 200}px` }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">
                      {new Date(0, index).toLocaleString('default', { month: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <TrendingUp className="h-12 w-12 mb-2" />
                <p>No revenue data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/admin/users"
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="text-blue-700 font-medium">Manage Users</span>
                <FaUsers className="text-blue-500" />
              </a>
              <a
                href="/admin/trainers"
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="text-purple-700 font-medium">Trainer Approvals</span>
                {stats.pendingTrainers > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingTrainers}
                  </span>
                )}
              </a>
              <a
                href="/admin/withdrawals"
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <span className="text-red-700 font-medium">Withdrawal Requests</span>
                {stats.pendingWithdrawals > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingWithdrawals}
                  </span>
                )}
              </a>
            </div>
          </div>

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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-2">
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">New user registration spike detected</span>
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
    </div>
  );
};

export default AdminDashboard;
