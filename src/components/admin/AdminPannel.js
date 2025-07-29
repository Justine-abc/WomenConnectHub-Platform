import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    if (activeTab === 'users') {
      setUsers([
        {
          id: 1,
          name: 'Sarah Wanjiku',
          email: 'sarah@example.com',
          type: 'entrepreneur',
          status: 'active',
          joinDate: '2024-01-15',
          projects: 2,
          location: 'Nairobi, Kenya'
        },
        {
          id: 2,
          name: 'John Investor',
          email: 'john@example.com',
          type: 'investor',
          status: 'active',
          joinDate: '2024-02-10',
          investments: 5,
          location: 'Lagos, Nigeria'
        },
        {
          id: 3,
          name: 'Grace Mutindi',
          email: 'grace@example.com',
          type: 'entrepreneur',
          status: 'pending',
          joinDate: '2024-03-05',
          projects: 0,
          location: 'Kampala, Uganda'
        }
      ]);
    } else if (activeTab === 'projects') {
      setProjects([
        {
          id: 1,
          title: 'EcoFriendly Fashion Line',
          entrepreneur: 'Sarah Wanjiku',
          status: 'active',
          fundingGoal: 15000,
          raisedAmount: 8500,
          category: 'fashion',
          submittedDate: '2024-01-20'
        },
        {
          id: 2,
          title: 'Smart Agriculture IoT',
          entrepreneur: 'Adunni Olatunji',
          status: 'pending',
          fundingGoal: 25000,
          raisedAmount: 0,
          category: 'technology',
          submittedDate: '2024-03-10'
        }
      ]);
    } else if (activeTab === 'approvals') {
      setPendingApprovals([
        {
          id: 1,
          type: 'user_verification',
          title: 'Entrepreneur Verification',
          user: 'Grace Mutindi',
          details: 'Business certificate verification required',
          submittedDate: '2024-03-05',
          urgency: 'medium'
        },
        {
          id: 2,
          type: 'project_approval',
          title: 'Smart Agriculture IoT',
          user: 'Adunni Olatunji',
          details: 'Project review and approval needed',
          submittedDate: '2024-03-10',
          urgency: 'high'
        }
      ]);
    }
    
    setLoading(false);
  };

  const handleUserAction = async (userId, action) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (action === 'approve') {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'active' } : user
      ));
    } else if (action === 'suspend') {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'suspended' } : user
      ));
    } else if (action === 'delete') {
      setUsers(users.filter(user => user.id !== userId));
    }
    
    setLoading(false);
  };

  const handleProjectAction = async (projectId, action) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (action === 'approve') {
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status: 'active' } : project
      ));
    } else if (action === 'reject') {
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status: 'rejected' } : project
      ));
    }
    
    setLoading(false);
  };

  const tabs = [
    { id: 'users', label: 'Users Management', icon: '👥' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'approvals', label: 'Pending Approvals', icon: '⏳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'reports', label: 'Reports', icon: '📊' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.entrepreneur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage your platform efficiently</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        {(activeTab === 'users' || activeTab === 'projects') && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                {activeTab === 'projects' && <option value="rejected">Rejected</option>}
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              {/* Users Management */}
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">User</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Type</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Join Date</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Activity</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.location}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.type === 'entrepreneur' 
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.type === 'entrepreneur' ? '👩‍💼 Entrepreneur' : '💼 Investor'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {user.projects ? `${user.projects} projects` : 
                             user.investments ? `${user.investments} investments` : 'No activity'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              {user.status === 'pending' && (
                                <button
                                  onClick={() => handleUserAction(user.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  ✅ Approve
                                </button>
                              )}
                              {user.status === 'active' && (
                                <button
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  ⏸️ Suspend
                                </button>
                              )}
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Projects Management */}
              {activeTab === 'projects' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Project</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Entrepreneur</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Category</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Funding</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map(project => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">
                              Submitted: {new Date(project.submittedDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{project.entrepreneur}</td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {project.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <div className="font-medium">${project.raisedAmount.toLocaleString()} / ${project.fundingGoal.toLocaleString()}</div>
                              <div className="text-gray-500">
                                {((project.raisedAmount / project.fundingGoal) * 100).toFixed(1)}% funded
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === 'active' ? 'bg-green-100 text-green-800' :
                              project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              {project.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleProjectAction(project.id, 'approve')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                  >
                                    ✅ Approve
                                  </button>
                                  <button
                                    onClick={() => handleProjectAction(project.id, 'reject')}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                  >
                                    ❌ Reject
                                  </button>
                                </>
                              )}
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                                👁️ View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pending Approvals */}
              {activeTab === 'approvals' && (
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingApprovals.map(approval => (
                      <div key={approval.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900">{approval.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                approval.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                approval.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {approval.urgency} priority
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{approval.details}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>👤 {approval.user}</span>
                              <span>📅 {new Date(approval.submittedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors">
                              ✅ Approve
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors">
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Platform Name
                            </label>
                            <input
                              type="text"
                              defaultValue="WomenConnect Hub"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Support Email
                            </label>
                            <input
                              type="email"
                              defaultValue="info@womenconnecthub.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Projects per User
                            </label>
                            <input
                              type="number"
                              defaultValue="5"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Platform Fee (%)
                            </label>
                            <input
                              type="number"
                              defaultValue="5"
                              min="0"
                              max="20"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                      <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        💾 Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports */}
              {activeTab === 'reports' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-3xl">📊</span>
                      <span className="font-medium">User Analytics</span>
                      <span className="text-sm text-gray-500">Download user activity report</span>
                    </button>
                    
                    <button className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-3xl">💰</span>
                      <span className="font-medium">Financial Report</span>
                      <span className="text-sm text-gray-500">Funding and transaction summary</span>
                    </button>
                    
                    <button className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-3xl">🚀</span>
                      <span className="font-medium">Project Report</span>
                      <span className="text-sm text-gray-500">Project performance metrics</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;