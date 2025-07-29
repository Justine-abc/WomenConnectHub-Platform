import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalFunding: 0,
    pendingApprovals: 0,
    entrepreneurs: 0,
    investors: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeframe]);

  const loadDashboardData = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    setStats({
      totalUsers: 1247,
      totalProjects: 485,
      totalFunding: 2340000,
      pendingApprovals: 23,
      entrepreneurs: 892,
      investors: 355,
      activeProjects: 156,
      completedProjects: 329
    });

    setRecentActivity([
      {
        id: 1,
        type: 'user_registered',
        message: 'New entrepreneur registered: Sarah Wanjiku',
        timestamp: '2 hours ago',
        icon: '👩‍💼'
      },
      {
        id: 2,
        type: 'project_submitted',
        message: 'New project submitted: EcoFriendly Fashion Line',
        timestamp: '4 hours ago',
        icon: '🚀'
      },
      {
        id: 3,
        type: 'investment_made',
        message: 'Investment of $5,000 made in Smart Agriculture IoT',
        timestamp: '6 hours ago',
        icon: '💰'
      },
      {
        id: 4,
        type: 'project_approved',
        message: 'Project approved: Artisan Craft Marketplace',
        timestamp: '8 hours ago',
        icon: '✅'
      },
      {
        id: 5,
        type: 'milestone_reached',
        message: 'Organic Skincare Products reached 50% funding',
        timestamp: '12 hours ago',
        icon: '🎯'
      }
    ]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, change, isPositive = true }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
              <span>{isPositive ? '↗️' : '↘️'}</span>
              {change}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name}! Here's what's happening on your platform.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <span>📊</span>
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            change="+12% from last month"
            isPositive={true}
          />
          <StatCard
            title="Total Projects"
            value={stats.totalProjects.toLocaleString()}
            icon="🚀"
            change="+8% from last month"
            isPositive={true}
          />
          <StatCard
            title="Total Funding"
            value={formatCurrency(stats.totalFunding)}
            icon="💰"
            change="+23% from last month"
            isPositive={true}
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon="⏳"
            change="-5% from last month"
            isPositive={true}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Entrepreneurs"
            value={stats.entrepreneurs.toLocaleString()}
            icon="👩‍💼"
            change="+15% from last month"
          />
          <StatCard
            title="Investors"
            value={stats.investors.toLocaleString()}
            icon="💼"
            change="+7% from last month"
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon="🔥"
            change="+10% from last month"
          />
          <StatCard
            title="Completed Projects"
            value={stats.completedProjects}
            icon="✅"
            change="+18% from last month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>📈</span>
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="text-xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-gray-500 text-sm">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  View All Activity →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>⚡</span>
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">👩‍💼</span>
                  <div>
                    <div className="font-medium text-gray-900">Manage Users</div>
                    <div className="text-sm text-gray-500">View and manage all users</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <div className="font-medium text-gray-900">Review Projects</div>
                    <div className="text-sm text-gray-500">Approve or reject projects</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="font-medium text-gray-900">Generate Reports</div>
                    <div className="text-sm text-gray-500">Create detailed analytics</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <div className="font-medium text-gray-900">Platform Settings</div>
                    <div className="text-sm text-gray-500">Configure platform settings</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="font-medium text-gray-900">Send Notifications</div>
                    <div className="text-sm text-gray-500">Broadcast messages to users</div>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="font-medium text-gray-900">Financial Reports</div>
                    <div className="text-sm text-gray-500">View funding and transactions</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🔧</span>
              System Health
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🟢</div>
                <div className="font-medium text-gray-900">Server Status</div>
                <div className="text-sm text-green-600">All systems operational</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">📡</div>
                <div className="font-medium text-gray-900">API Performance</div>
                <div className="text-sm text-green-600">Response time: 120ms</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💾</div>
                <div className="font-medium text-gray-900">Database</div>
                <div className="text-sm text-green-600">Healthy - 89% capacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;