import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import SearchBar from '../common/SearchBar';

const InvestorPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [projects, setProjects] = useState([]);
  const [myInvestments, setMyInvestments] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    category: '',
    location: '',
    fundingStage: '',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data for projects
    const mockProjects = [
      {
        id: 1,
        title: "EcoFriendly Fashion Line",
        description: "Sustainable clothing made from recycled materials, empowering local artisans while protecting our environment.",
        category: "fashion",
        location: "Nairobi, Kenya",
        fundingGoal: 15000,
        raisedAmount: 8500,
        imageUrl: "https://drive.google.com/file/d/sample1",
        entrepreneur: {
          name: "Sarah Wanjiku",
          location: "Nairobi, Kenya",
          avatar: "👩‍💼"
        },
        status: "active",
        daysLeft: 25,
        investorCount: 12,
        minimumInvestment: 100,
        expectedReturn: "15-20%",
        riskLevel: "Medium"
      },
      {
        id: 2,
        title: "Smart Agriculture IoT System",
        description: "Innovative IoT-based system for small-scale farmers to monitor soil moisture and crop health.",
        category: "technology",
        location: "Lagos, Nigeria",
        fundingGoal: 25000,
        raisedAmount: 12000,
        imageUrl: "https://drive.google.com/file/d/sample2",
        entrepreneur: {
          name: "Adunni Olatunji",
          location: "Lagos, Nigeria",
          avatar: "👩‍💻"
        },
        status: "active",
        daysLeft: 18,
        investorCount: 8,
        minimumInvestment: 500,
        expectedReturn: "25-30%",
        riskLevel: "High"
      },
      {
        id: 3,
        title: "Organic Skincare Products",
        description: "Natural skincare line using indigenous African plants and traditional beauty secrets.",
        category: "beauty",
        location: "Accra, Ghana",
        fundingGoal: 8000,
        raisedAmount: 5200,
        imageUrl: "https://drive.google.com/file/d/sample4",
        entrepreneur: {
          name: "Akosua Mensah",
          location: "Accra, Ghana",
          avatar: "👩‍🔬"
        },
        status: "active",
        daysLeft: 35,
        investorCount: 15,
        minimumInvestment: 50,
        expectedReturn: "12-18%",
        riskLevel: "Low"
      }
    ];

    // Mock data for my investments
    const mockInvestments = [
      {
        id: 1,
        projectId: 3,
        projectTitle: "Artisan Craft Marketplace",
        entrepreneur: "Nomsa Mthembu",
        investmentAmount: 2000,
        investmentDate: "2024-01-15",
        currentValue: 2300,
        status: "active",
        roi: 15,
        expectedReturn: "18-22%",
        updates: 3
      },
      {
        id: 2,
        projectId: 4,
        projectTitle: "Mobile Health App",
        entrepreneur: "Grace Mutindi",
        investmentAmount: 1500,
        investmentDate: "2024-02-10",
        currentValue: 1680,
        status: "completed",
        roi: 12,
        expectedReturn: "15-20%",
        updates: 5
      }
    ];

    // Mock portfolio data
    const mockPortfolio = {
      totalInvested: 3500,
      currentValue: 3980,
      totalReturn: 480,
      roiPercentage: 13.7,
      activeInvestments: 1,
      completedInvestments: 1,
      averageReturn: 13.5
    };

    setProjects(mockProjects);
    setMyInvestments(mockInvestments);
    setPortfolio(mockPortfolio);
    setLoading(false);
  };

  const handleInvest = (projectId, amount) => {
    // Handle investment logic
    console.log(`Investing $${amount} in project ${projectId}`);
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    // Apply search filters to projects
    // This would typically make an API call
  };

  const tabs = [
    { id: 'discover', label: 'Discover Projects', icon: '🔍' },
    { id: 'portfolio', label: 'My Portfolio', icon: '📊' },
    { id: 'investments', label: 'My Investments', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
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
          investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {investment.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Investment Amount</div>
          <div className="text-lg font-semibold">${investment.investmentAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Current Value</div>
          <div className="text-lg font-semibold text-green-600">${investment.currentValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">ROI</div>
          <div className={`text-lg font-semibold ${investment.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {investment.roi > 0 ? '+' : ''}{investment.roi}%
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Investment Date</div>
          <div className="text-sm">{new Date(investment.investmentDate).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{investment.updates} updates received</span>
          <Link
            to={`/projects/${investment.projectId}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );

  const ProjectCardWithInvestment = ({ project }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <div className="flex items-center justify-center text-4xl">
          📸
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
            project.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {project.riskLevel} Risk
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{project.entrepreneur.avatar}</span>
          <div>
            <div className="font-medium text-gray-900">{project.entrepreneur.name}</div>
            <div className="text-sm text-gray-500">{project.entrepreneur.location}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{((project.raisedAmount / project.fundingGoal) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(project.raisedAmount / project.fundingGoal) * 100}%` }}
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
          <div>
            <div className="text-gray-500">Min. Investment</div>
            <div className="font-semibold">${project.minimumInvestment}</div>
          </div>
          <div>
            <div className="text-gray-500">Expected Return</div>
            <div className="font-semibold text-blue-600">{project.expectedReturn}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => handleInvest(project.id, project.minimumInvestment)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Invest Now
          </button>
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>{project.investorCount} investors</span>
          <span>{project.daysLeft} days left</span>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Investor Portal</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name}! Discover and invest in amazing women-led projects.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Portfolio Value</div>
                <div className="text-2xl font-bold text-green-600">
                  ${portfolio.currentValue?.toLocaleString() || '0'}
                </div>
              </div>
              <Link
                to="/profile"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                👤 Profile
              </Link>
            </div>
          </div>
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            {/* Discover Projects Tab */}
            {activeTab === 'discover' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover Investment Opportunities</h2>
                  <SearchBar 
                    onSearch={handleSearch}
                    showFilters={true}
                    placeholder="Search projects by title, category, or entrepreneur..."
                    className="mb-6"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <ProjectCardWithInvestment key={project.id} project={project} />
                  ))}
                </div>

                {projects.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600">Try adjusting your search filters to find more projects.</p>
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💰</span>
                      <h3 className="font-medium text-gray-700">Total Invested</h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">${portfolio.totalInvested?.toLocaleString()}</div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📈</span>
                      <h3 className="font-medium text-gray-700">Current Value</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600">${portfolio.currentValue?.toLocaleString()}</div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎯</span>
                      <h3 className="font-medium text-gray-700">Total Return</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600">+${portfolio.totalReturn?.toLocaleString()}</div>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Distribution</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Investments</span>
                        <span className="font-semibold">{portfolio.activeInvestments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completed Investments</span>
                        <span className="font-semibold">{portfolio.completedInvestments}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        🔍 Discover New Projects
                      </button>
                      <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                        📊 Download Portfolio Report
                      </button>
                      <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                        ⚙️ Investment Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Investments Tab */}
            {activeTab === 'investments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Investments</h2>
                  <div className="flex gap-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myInvestments.map(investment => (
                    <InvestmentCard key={investment.id} investment={investment} />
                  ))}
                </div>

                {myInvestments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No investments yet</h3>
                    <p className="text-gray-600 mb-4">Start investing in amazing women-led projects to see them here.</p>
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Discover Projects
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Best Performing Investment</span>
                        <span className="font-semibold text-green-600">+23%</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Portfolio Diversification</span>
                        <span className="font-semibold">3 Sectors</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Investment Timeline</span>
                        <span className="font-semibold">8 Months</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Categories</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Technology</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Fashion</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Beauty</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-pink-600 h-2 rounded-full" style={{width: '15%'}}></div>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <span className="text-xl">💰</span>
                      <div className="flex-1">
                        <div className="font-medium">Investment in Mobile Health App completed</div>
                        <div className="text-sm text-gray-500">ROI: +12% • 2 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <span className="text-xl">📈</span>
                      <div className="flex-1">
                        <div className="font-medium">Artisan Craft Marketplace milestone reached</div>
                        <div className="text-sm text-gray-500">50% funding goal achieved • 5 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <span className="text-xl">🎯</span>
                      <div className="flex-1">
                        <div className="font-medium">New project recommendation available</div>
                        <div className="text-sm text-gray-500">Based on your investment preferences • 1 week ago</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvestorPortal;