import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import ProjectUploadModal from './ProjectUploadModal';
import ProjectCard from '../common/ProjectCard';
import api from '../../services/api';

const EntrepreneurDashboard = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalFunding: 0,
    pendingProjects: 0
  });

  // Move loadDashboardData inside useEffect or use useCallback
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load user's projects
        const { data: projectsData, error: projectsError } = await api.projects.getAll({
          userId: user.id
        });

        if (!projectsError && projectsData) {
          setMyProjects(projectsData);
          
          // Calculate stats based on actual database schema
          // Since we don't have status or raisedAmount fields yet, we'll use basic counts
          const totalProjects = projectsData.length;
          const activeProjects = projectsData.length; // All projects are considered active for now
          const pendingProjects = 0; // No pending status in current schema
          const totalFunding = 0; // No funding amount in current schema

          setStats({
            totalProjects,
            activeProjects,
            pendingProjects,
            totalFunding
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const handleProjectCreated = (newProject) => {
    // Add the new project to the list
    setMyProjects(prev => [newProject, ...prev]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalProjects: prev.totalProjects + 1,
      pendingProjects: prev.pendingProjects + 1
    }));

    // Show success message
    alert('Project created successfully! It will be reviewed by our team.');
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`text-3xl`}>{icon}</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.firstName || user?.name || 'User'}! Manage your projects and connect with investors.
              </p>
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>🚀</span>
              Upload New Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon="📊"
            color="blue"
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon="🔥"
            color="green"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingProjects}
            icon="⏳"
            color="yellow"
          />
          <StatCard
            title="Total Raised"
            value={`$${(stats.totalFunding || 0).toLocaleString()}`}
            icon="💰"
            color="purple"
          />
        </div>

        {/* My Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            {myProjects.length > 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Another Project
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading projects...</span>
            </div>
          ) : myProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  showOwnerActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                Start by uploading your first project to connect with investors.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Upload Your First Project
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-medium text-gray-900">View Analytics</div>
                <div className="text-sm text-gray-500">Track your project performance</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-medium text-gray-900">Messages</div>
                <div className="text-sm text-gray-500">Connect with investors</div>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <span className="text-2xl">⚙️</span>
              <div>
                <div className="font-medium text-gray-900">Profile Settings</div>
                <div className="text-sm text-gray-500">Update your information</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Project Upload Modal */}
      <ProjectUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
};

export default EntrepreneurDashboard;