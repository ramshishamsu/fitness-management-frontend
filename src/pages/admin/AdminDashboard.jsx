import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Dumbbell, Calendar, DollarSign, UserCheck, AlertTriangle, FileText, TrendingUp, Activity, Zap, Shield, Target } from 'lucide-react';
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

  const StatCard = ({ title, value, icon: Icon, color, link, trend, subtitle }) => (
    <Link to={link || '#'} className="block group">
      <div className={`
        ${color} 
        rounded-2xl shadow-lg p-6 text-white 
        hover:shadow-2xl transition-all duration-300 
        transform hover:-translate-y-1 hover:scale-105
        relative overflow-hidden
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium mb-1">{title}</p>
              <p className="text-3xl font-bold mb-1">{value.toLocaleString()}</p>
              {subtitle && (
                <p className="text-white/70 text-xs">{subtitle}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {trend && (
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span className="text-white/80">{trend}</span>
            </div>
          )}
        </div>
        
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 font-medium">Loading Dashboard</p>
            <p className="text-slate-400 text-sm">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/90 text-lg">Manage your fitness management system with powerful insights</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-300" />
            <span className="text-emerald-300 font-medium">System Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-gradient-to-br from-blue-600 to-blue-700"
          link="/admin/users"
          trend="+12% this month"
          subtitle="Active members"
        />
        <StatCard
          title="Total Trainers"
          value={stats.totalTrainers}
          icon={Dumbbell}
          color="bg-gradient-to-br from-purple-600 to-purple-700"
          link="/admin/trainers"
          trend="+8% this month"
          subtitle="Certified professionals"
        />
        <StatCard
          title="Pending Trainers"
          value={stats.pendingTrainers}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-amber-600 to-orange-600"
          link="/admin/trainers?status=pending"
          subtitle="Awaiting approval"
        />
        <StatCard
          title="Appointments"
          value={stats.appointments}
          icon={Calendar}
          color="bg-gradient-to-br from-emerald-600 to-teal-600"
          link="/admin/appointments"
          trend="+15% this week"
          subtitle="Scheduled sessions"
        />
      </div>

      {/* Stats Grid - Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-600 to-emerald-600"
          link="/admin/payments"
          trend="+20% this month"
          subtitle="Gross earnings"
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-red-600 to-pink-600"
          link="/admin/withdrawals"
          subtitle="Requires action"
        />
        <StatCard
          title="Active Plans"
          value={stats.plans}
          icon={FileText}
          color="bg-gradient-to-br from-cyan-600 to-blue-600"
          link="/admin/plans"
          trend="+5% this month"
          subtitle="Subscription plans"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={UserCheck}
          color="bg-gradient-to-br from-indigo-600 to-purple-600"
          link="/admin/users?status=active"
          trend="+18% this month"
          subtitle="Currently online"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <Zap className="w-5 h-5 text-amber-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Users className="w-5 h-5 mr-3" />
            <span className="font-medium">Manage Users</span>
          </Link>
          <Link
            to="/admin/trainers"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <Dumbbell className="w-5 h-5 mr-3" />
            <span className="font-medium">Manage Trainers</span>
          </Link>
          <Link
            to="/admin/payments"
            className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <DollarSign className="w-5 h-5 mr-3" />
            <span className="font-medium">View Payments</span>
          </Link>
        </div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">System Health</h3>
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Server Status</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Database</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">API Response</span>
              <span className="text-slate-700 font-medium">&lt;100ms</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">New Users Today</span>
              <span className="text-slate-700 font-medium">+24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sessions Completed</span>
              <span className="text-slate-700 font-medium">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Revenue Today</span>
              <span className="text-slate-700 font-medium">$1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
