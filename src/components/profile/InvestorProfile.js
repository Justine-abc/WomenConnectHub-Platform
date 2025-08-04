import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';

const InvestorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock profile data
    const mockProfile = {
      id: user?.id || 1,
      name: user?.name || "John Investment",
      email: user?.email || "john.investor@example.com",
      companyName: user?.profile?.companyName || "Investment Partners Ltd",
      profileImage: user?.profile?.profileImage || "",
      location: `${user?.profile?.city || "Lagos"}, ${user?.profile?.country || "Nigeria"}`,
      bio: "Experienced investor focused on supporting women-led startups across Africa. With over 10 years in venture capital, I'm passionate about funding innovative solutions that create positive social impact.",
      interests: ["Technology", "Fashion", "HealthTech", "AgriTech", "Education", "Sustainability"],
      investmentRange: "$1,000 - $50,000",
      totalInvestments: 15,
      website: "https://investmentpartners.com",
      social: {
        linkedin: "https://linkedin.com/in/johninvestor",
        twitter: "https://twitter.com/johninvestor"
      },
      joinDate: "March 2023",
      rating: 4.9,
      reviews: 18,
      verifiedInvestor: true
    };

    // Mock portfolio data
    const mockPortfolio = {
      totalInvested: 125000,
      currentValue: 147500,
      totalReturn: 22500,
      roiPercentage: 18,
      activeInvestments: 8,
      completedInvestments: 7,
      averageReturn: 15.3,
      bestPerforming: "HealthTech Solutions",
      portfolioGrowth: "+18%"
    };

    // Mock investments data
    const mockInvestments = [
      {
        id: 1,
        projectTitle: "EcoFriendly Fashion Line",
        entrepreneur: "Sarah Wanjiku",
        category: "Fashion",
        investmentAmount: 5000,
        currentValue: 6200,
        roi: 24,
        status: "active",
        investmentDate: "2024-01-15",
        lastUpdate: "2024-03-10"
      },
      {
        id: 2,
        projectTitle: "Smart Agriculture IoT",
        entrepreneur: "Adunni Olatunji",
        category: "Technology",
        investmentAmount: 10000,
        currentValue: 11800,
        roi: 18,
        status: "active",
        investmentDate: "2024-02-01",
        lastUpdate: "2024-03-05"
      },
      {
        id: 3,
        projectTitle: "Mobile Health App",
        entrepreneur: "Grace Mutindi",
        category: "HealthTech",
        investmentAmount: 7500,
        currentValue: 8250,
        roi: 10,
        status: "completed",
        investmentDate: "2023-11-10",
        lastUpdate: "2024-02-20"
      }
    ];

    setProfile(mockProfile);
    setPortfolio(mockPortfolio);
    setInvestments(mockInvestments);
    setLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'portfolio', label: 'Portfolio', icon: '📊' },
    { id: 'investments', label: 'Investments', icon: '💰' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  const InvestmentCard = ({ investment }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{investment.projectTitle}</h3>
          <p className="text-gray-600">by {investment.entrepreneur}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          investment.status === 'active' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {investment.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Investment</div>
          <div className="text-lg font-semibold">${investment.investmentAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Current Value</div>
          <div className="text-lg font-semibold text-green-600">${investment.currentValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-gray-500">ROI</div>
          <div className={`text-lg font-semibold ${investment.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {investment.roi > 0 ? '+' : ''}{investment.roi}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Category</div>
          <div className="text-sm font-medium">{investment.category}</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Invested: {new Date(investment.investmentDate).toLocaleDateString()}</span>
          <Link
            to={`/projects/${investment.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details →
          </Link>
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
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    {profile.verifiedInvestor && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        ✓ Verified Investor
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-blue-600 font-medium mb-2">{profile.companyName}</p>
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
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span className="text-sm text-gray-600">Range: {profile.investmentRange}</span>
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
              <div className="text-2xl font-bold text-green-600">${portfolio.totalInvested.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Invested</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{portfolio.activeInvestments}</div>
              <div className="text-sm text-gray-600">Active Investments</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{portfolio.averageReturn}%</div>
              <div className="text-sm text-gray-600">Avg. Return</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{portfolio.portfolioGrowth}</div>
              <div className="text-sm text-gray-600">Portfolio Growth</div>
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
                    <h3 className="font-medium text-gray-900 mb-2">Investment Range</h3>
                    <p className="text-gray-600">{profile.investmentRange}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Total Investments</h3>
                    <p className="text-gray-600">{profile.totalInvestments} projects</p>
                  </div>
                </div>
              </div>

              {/* Investment Interests */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Investments */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Investments</h2>
                <div className="space-y-4">
                  {investments.slice(0, 3).map(investment => (
                    <div key={investment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{investment.projectTitle}</div>
                        <div className="text-sm text-gray-600">by {investment.entrepreneur}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+{investment.roi}%</div>
                        <div className="text-sm text-gray-500">${investment.investmentAmount.toLocaleString()}</div>
                      </div>
                    </div>
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
                        Company Website
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
                  </div>
                </div>
              </div>

              {/* Portfolio Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value</span>
                    <span className="font-semibold text-green-600">${portfolio.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Return</span>
                    <span className="font-semibold text-green-600">+${portfolio.totalReturn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Performer</span>
                    <span className="font-semibold">{portfolio.bestPerforming}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-medium text-gray-700">Total Invested</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900">${portfolio.totalInvested.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📈</span>
                  <h3 className="font-medium text-gray-700">Current Value</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">${portfolio.currentValue.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-medium text-gray-700">Total Return</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">+${portfolio.totalReturn.toLocaleString()}</div>
                <div className="text-sm text-green-600">+{portfolio.roiPercentage}%</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏆</span>
                  <h3 className="font-medium text-gray-700">Avg. Return</h3>
                </div>
                <div className="text-2xl font-bold text-blue-600">{portfolio.averageReturn}%</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Performance Chart</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">📊 Portfolio performance chart would be displayed here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Investments</h2>
              <Link
                to="/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>🔍</span>
                Discover Projects
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map(investment => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Preferences</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Amount</label>
                      <input
                        type="number"
                        defaultValue="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Amount</label>
                      <input
                        type="number"
                        defaultValue="50000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Technology', 'Fashion', 'HealthTech', 'AgriTech', 'Education', 'Sustainability'].map(category => (
                      <label key={category} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Preferences</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All African Countries</option>
                    <option>East Africa</option>
                    <option>West Africa</option>
                    <option>Southern Africa</option>
                    <option>North Africa</option>
                  </select>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  💾 Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorProfile;