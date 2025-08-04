import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';

const EntrepreneurProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock profile data
      const mockProfile = {
        id: user?.id || 1,
      firstName: user?.firstName || "Sarah",
      lastName: user?.lastName || "Wanjiku",
      email: user?.email || "sarah.wanjiku@example.com",
      profileImage: user?.profile?.profileImage || "",
      location: `${user?.profile?.city || "Nairobi"}, ${user?.profile?.country || "Kenya"}`,
      bio: "Passionate entrepreneur focused on sustainable fashion and empowering local artisans. With 5 years of experience in the fashion industry, I'm committed to creating eco-friendly solutions that make a positive impact.",
      skills: ["Sustainable Fashion", "Business Development", "Team Leadership", "Marketing", "Supply Chain Management"],
      experience: "5+ years in Fashion Industry",
      education: "MBA in Business Administration",
      website: "https://sarahfashion.com",
      social: {
        linkedin: "https://linkedin.com/in/sarahwanjiku",
        twitter: "https://twitter.com/sarahwanjiku",
        instagram: "https://instagram.com/saraheco"
      },
      joinDate: "January 2024",
      totalRaised: 23500,
      projectsCount: 3,
      successRate: 85,
      rating: 4.8,
      reviews: 24
    };

    // Mock projects data
    const mockProjects = [
      {
        id: 1,
        title: "EcoFriendly Fashion Line",
        description: "Sustainable clothing made from recycled materials",
        category: "Fashion",
        status: "active",
        fundingGoal: 15000,
        raisedAmount: 12500,
        progress: 83,
        daysLeft: 15,
        investorCount: 18,
        image: "https://drive.google.com/file/d/sample1",
        featured: true
      },
      {
        id: 2,
        title: "Artisan Craft Marketplace",
        description: "Platform connecting local artisans with global markets",
        category: "Technology",
        status: "completed",
        fundingGoal: 8000,
        raisedAmount: 8000,
        progress: 100,
        daysLeft: 0,
        investorCount: 12,
        image: "https://drive.google.com/file/d/sample2",
        completedDate: "2024-02-15"
      },
      {
        id: 3,
        title: "Sustainable Packaging Solutions",
        description: "Biodegradable packaging for small businesses",
        category: "Environment",
        status: "draft",
        fundingGoal: 20000,
        raisedAmount: 0,
        progress: 0,
        daysLeft: 0,
        investorCount: 0,
        image: "https://drive.google.com/file/d/sample3"
      }
    ];

    // Mock achievements
    const mockAchievements = [
      {
        id: 1,
        title: "Top Entrepreneur 2024",
        description: "Recognized as one of the top entrepreneurs in sustainable fashion",
        date: "March 2024",
        icon: "🏆"
      },
      {
        id: 2,
        title: "Fully Funded Project",
        description: "Successfully funded Artisan Craft Marketplace project",
        date: "February 2024",
        icon: "💰"
      },
      {
        id: 3,
        title: "Community Impact Award",
        description: "Awarded for positive impact on local artisan community",
        date: "January 2024",
        icon: "🌟"
      }
    ];

    setProfile(mockProfile);
    setProjects(mockProjects);
    setAchievements(mockAchievements);
    setLoading(false);
    };

    loadProfileData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
  ];

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <div className="flex items-center justify-center text-4xl">📸</div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.status === 'active' ? 'bg-green-100 text-green-800' :
            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{project.description}</p>

        {project.status !== 'draft' && (
          <>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="text-gray-500">Goal</div>
                <div className="font-semibold">${project.fundingGoal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-500">Raised</div>
                <div className="font-semibold text-green-600">${project.raisedAmount.toLocaleString()}</div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors text-center"
          >
            View Details
          </Link>
          {project.status === 'draft' && (
            <Link
              to={`/projects/${project.id}/edit`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <span>📍</span>
                    {profile.location}
                  </p>
                  <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span className="text-sm text-gray-600">Joined {profile.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⭐</span>
                      <span className="text-sm text-gray-600">{profile.rating}/5 ({profile.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/profile/edit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    ✏️ Edit Profile
                  </Link>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    📤 Share Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">${profile.totalRaised.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Raised</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{profile.projectsCount}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{profile.rating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{profile.bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
                    <p className="text-gray-600">{profile.experience}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Education</h3>
                    <p className="text-gray-600">{profile.education}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span>📧</span>
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                      {profile.email}
                    </a>
                  </div>
                  {profile.website && (
                    <div className="flex items-center gap-3">
                      <span>🌐</span>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Social Media</h3>
                  <div className="flex gap-3">
                    {profile.social.linkedin && (
                      <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        LinkedIn
                      </a>
                    )}
                    {profile.social.twitter && (
                      <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        Twitter
                      </a>
                    )}
                    {profile.social.instagram && (
                      <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="flex items-start gap-3">
                      <span className="text-xl">{achievement.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
              <Link
                to="/projects/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>➕</span>
                New Project
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Start your entrepreneurial journey by creating your first project.</p>
                <Link
                  to="/projects/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Project
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Awards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map(achievement => (
                <div key={achievement.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                      <p className="text-gray-600 mb-2">{achievement.description}</p>
                      <p className="text-sm text-gray-500">{achievement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Testimonials</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">John Doe</h4>
                      <div className="flex text-yellow-400">
                        ⭐⭐⭐⭐⭐
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">
                      "Sarah's EcoFriendly Fashion project exceeded all expectations. Her commitment to sustainability and quality is remarkable."
                    </p>
                    <p className="text-sm text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">Mary Smith</h4>
                      <div className="flex text-yellow-400">
                        ⭐⭐⭐⭐⭐
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">
                      "Excellent communication throughout the project. Sarah delivered on time and the results were outstanding."
                    </p>
                    <p className="text-sm text-gray-500">1 month ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepreneurProfile;