import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { createGoogleDriveViewUrl, extractYouTubeId } from '../../utils/urlHelpers';

const ProjectDetails = ({ project, onClose, onEdit, onInvest }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if project is bookmarked (simulate with localStorage)
    const bookmarks = JSON.parse(localStorage.getItem('wch_bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(project.id));
  }, [project.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = () => {
    if (!project.raisedAmount || !project.fundingGoal) return 0;
    return Math.min((project.raisedAmount / project.fundingGoal) * 100, 100);
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('wch_bookmarks') || '[]');
    if (isBookmarked) {
      const updated = bookmarks.filter(id => id !== project.id);
      localStorage.setItem('wch_bookmarks', JSON.stringify(updated));
    } else {
      bookmarks.push(project.id);
      localStorage.setItem('wch_bookmarks', JSON.stringify(bookmarks));
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleInvest = async () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    try {
      await onInvest({
        projectId: project.id,
        amount: parseFloat(investAmount),
        message: message,
        investorId: user.id
      });
      setShowInvestModal(false);
      setInvestAmount('');
      setMessage('');
    } catch (error) {
      alert('Failed to process investment. Please try again.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'details', label: 'Details', icon: '📝' },
    { id: 'media', label: 'Media', icon: '📸' },
    { id: 'entrepreneur', label: 'Entrepreneur', icon: '👩‍💼' },
  ];

  const imageUrl = createGoogleDriveViewUrl(project.imageUrl);
  const youtubeId = extractYouTubeId(project.videoUrl);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'funded' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'active' ? '🟢 Active' :
                   project.status === 'funded' ? '✅ Funded' : '⏸️ Paused'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <span>📂</span>
                  {project.category}
                </span>
                <span className="flex items-center gap-1">
                  <span>👩‍💼</span>
                  {project.entrepreneur?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {user?.id === project.entrepreneur?.id && (
                <button
                  onClick={onEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Edit Project
                </button>
              )}

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl p-1"
              >
                ×
              </button>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(project.raisedAmount || 0)}
                </span>
                <span className="text-gray-600 ml-2">
                  of {formatCurrency(project.fundingGoal)} goal
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{project.daysLeft || 30} days left</div>
                <div className="text-sm text-gray-500">{project.backersCount || 0} backers</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>{getProgressPercentage().toFixed(1)}% funded</span>
              <span>{(project.fundingGoal - (project.raisedAmount || 0)) > 0 
                ? `${formatCurrency(project.fundingGoal - (project.raisedAmount || 0))} remaining`
                : 'Goal reached!'
              }</span>
            </div>
          </div>

          {/* Action Buttons */}
          {isAuthenticated() && user?.id !== project.entrepreneur?.id && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowInvestModal(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>💰</span>
                Invest in this Project
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                💬 Contact
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
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
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Project Image */}
              {imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={project.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Timeline</h4>
                  <p className="text-gray-700">{project.timeline || 'Not specified'}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Team Size</h4>
                  <p className="text-gray-700">
                    {project.teamSize === 1 ? 'Solo entrepreneur' : 
                     project.teamSize === 2 ? '2 people' :
                     project.teamSize === 3 ? '3-5 people' :
                     project.teamSize === 4 ? '6-10 people' :
                     'More than 10 people'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {project.targetMarket && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Market</h3>
                  <p className="text-gray-700 leading-relaxed">{project.targetMarket}</p>
                </div>
              )}

              {project.competitiveAdvantage && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Competitive Advantage</h3>
                  <p className="text-gray-700 leading-relaxed">{project.competitiveAdvantage}</p>
                </div>
              )}

              {project.businessPlan && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Plan</h3>
                  <a
                    href={project.businessPlan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>📄</span>
                    View Business Plan
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Previous Experience</h4>
                  <p className="text-gray-700 capitalize">
                    {project.previousExperience?.replace('-', ' ') || 'Not specified'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">{project.location}, {project.country}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              {imageUrl && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Images</h3>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={project.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                </div>
              )}

              {youtubeId && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Video</h3>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="Project Video"
                      className="w-full h-96"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {!imageUrl && !youtubeId && (
                <div className="text-center py-12 text-gray-500">
                  <span className="text-6xl mb-4 block">📸</span>
                  <p>No media files uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'entrepreneur' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {project.entrepreneur?.name?.charAt(0) || '👩‍💼'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.entrepreneur?.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      📍 {project.entrepreneur?.location}
                    </p>
                    <p className="text-gray-600 mb-4">
                      ✉️ {project.entrepreneur?.email}
                    </p>
                    
                    {isAuthenticated() && user?.id !== project.entrepreneur?.id && (
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        💬 Send Message
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">About the Entrepreneur</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Experience Level</h5>
                    <p className="text-gray-700 capitalize">
                      {project.previousExperience?.replace('-', ' ') || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Projects Created</h5>
                    <p className="text-gray-700">1 project</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Investment Modal */}
        {showInvestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Invest in "{project.title}"
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount (USD) *
                  </label>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    min="10"
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Entrepreneur (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Share your thoughts or questions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleInvest}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    💰 Invest Now
                  </button>
                  <button
                    onClick={() => setShowInvestModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;