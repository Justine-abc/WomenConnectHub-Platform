import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import AuthModal from '../auth/AuthModal';
import ProjectCard from '../common/ProjectCard';
import SearchBar from '../common/SearchBar';
import Footer from '../common/Footer';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [searchResults, setSearchResults] = useState(null);

  // Mock data for featured projects
  const featuredProjects = [
    {
      id: 1,
      title: "EcoFriendly Fashion Line",
      description: "Sustainable clothing made from recycled materials, empowering local artisans while protecting our environment. Join us in revolutionizing fashion with eco-conscious designs.",
      category: "fashion",
      location: "Nairobi, Kenya",
      fundingGoal: 15000,
      raisedAmount: 8500,
      imageUrl: "https://drive.google.com/file/d/sample1",
      entrepreneur: {
        name: "Sarah Wanjiku",
        location: "Nairobi, Kenya"
      },
      status: "active",
      daysLeft: 25
    },
    {
      id: 2,
      title: "Smart Agriculture IoT System",
      description: "Innovative IoT-based system for small-scale farmers to monitor soil moisture, weather conditions, and crop health remotely using mobile technology.",
      category: "technology",
      location: "Lagos, Nigeria",
      fundingGoal: 25000,
      raisedAmount: 12000,
      imageUrl: "https://drive.google.com/file/d/sample2",
      entrepreneur: {
        name: "Adunni Olatunji",
        location: "Lagos, Nigeria"
      },
      status: "active",
      daysLeft: 18
    },
    {
      id: 3,
      title: "Artisan Craft Marketplace",
      description: "Digital platform connecting African artisans with global markets, featuring handmade crafts, jewelry, and traditional art pieces.",
      category: "crafts",
      location: "Cape Town, South Africa",
      fundingGoal: 10000,
      raisedAmount: 10000,
      imageUrl: "https://drive.google.com/file/d/sample3",
      entrepreneur: {
        name: "Nomsa Mthembu",
        location: "Cape Town, South Africa"
      },
      status: "funded",
      daysLeft: 0
    },
    {
      id: 4,
      title: "Organic Skincare Products",
      description: "Natural skincare line using indigenous African plants and traditional beauty secrets passed down through generations.",
      category: "beauty",
      location: "Accra, Ghana",
      fundingGoal: 8000,
      raisedAmount: 5200,
      imageUrl: "https://drive.google.com/file/d/sample4",
      entrepreneur: {
        name: "Akosua Mensah",
        location: "Accra, Ghana"
      },
      status: "active",
      daysLeft: 35
    }
  ];

  const handleSearch = (searchParams) => {
    // Mock search functionality
    console.log('Search params:', searchParams);
    setSearchResults(featuredProjects.filter(project => 
      project.title.toLowerCase().includes(searchParams.query.toLowerCase()) ||
      project.description.toLowerCase().includes(searchParams.query.toLowerCase())
    ));
  };

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      // Redirect based on user type
      if (user.type === 'entrepreneur') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/projects';
      }
    } else {
      setAuthMode('register');
      setShowAuthModal(true);
    }
  };

  const stats = [
    { number: '150+', label: 'Women Entrepreneurs', icon: '👩‍💼' },
    { number: '85+', label: 'Funded Projects', icon: '🚀' },
    { number: '$2.3M+', label: 'Total Funding', icon: '💰' },
    { number: '15+', label: 'African Countries', icon: '🌍' }
  ];

  const features = [
    {
      icon: '🚀',
      title: 'Launch Your Project',
      description: 'Create compelling project profiles with business plans, goals, and showcase your vision to potential investors.'
    },
    {
      icon: '💰',
      title: 'Secure Funding',
      description: 'Connect with investors who believe in women-led innovation and are ready to support your entrepreneurial journey.'
    },
    {
      icon: '🌍',
      title: 'Global Network',
      description: 'Join a community of like-minded women entrepreneurs across Africa and beyond, sharing knowledge and opportunities.'
    },
    {
      icon: '📈',
      title: 'Track Progress',
      description: 'Monitor your project\'s performance, investor engagement, and funding milestones through our comprehensive dashboard.'
    }
  ];

  const testimonials = [
    {
      name: "Grace Mutindi",
      role: "Tech Entrepreneur",
      location: "Nairobi, Kenya",
      text: "WomenConnect Hub helped me raise $15,000 for my mobile app. The platform made it easy to connect with investors who understood my vision.",
      project: "HealthTracker App",
      avatar: "👩‍💻"
    },
    {
      name: "Fatima Al-Rashid",
      role: "Fashion Designer",
      location: "Cairo, Egypt",
      text: "Thanks to this platform, I was able to scale my sustainable fashion brand and now employ 12 local artisans. It's been life-changing!",
      project: "EcoChic Fashion",
      avatar: "👗"
    },
    {
      name: "Amara Johnson",
      role: "AgTech Innovator",
      location: "Accra, Ghana",
      text: "The mentorship and funding I received through WomenConnect Hub enabled me to launch my smart farming solution across 5 countries.",
      project: "SmartFarm Solutions",
      avatar: "🌱"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Empowering African Women 
                <span className="text-yellow-400"> Entrepreneurs</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Connect with investors, showcase your innovative projects, and join a thriving community 
                of women building the future of Africa.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleGetStarted}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors transform hover:scale-105"
                >
                  🚀 Get Started Today
                </button>
                <Link
                  to="/projects"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-4 px-8 rounded-lg text-lg transition-colors text-center"
                >
                  💡 Explore Projects
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-center">Start Your Journey</h3>
                
                {isAuthenticated() ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                      👋
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Welcome back, {user.name}!</h4>
                    <p className="text-blue-100 mb-6">Ready to continue your entrepreneurial journey?</p>
                    <Link
                      to="/dashboard"
                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-lg transition-colors inline-block"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setAuthMode('register');
                        setShowAuthModal(true);
                      }}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      👩‍💼 Join as Entrepreneur
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('register');
                        setShowAuthModal(true);
                      }}
                      className="w-full border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      💰 Join as Investor
                    </button>
                    
                    <div className="text-center pt-4">
                      <span className="text-blue-200">Already have an account? </span>
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setShowAuthModal(true);
                        }}
                        className="text-yellow-400 hover:text-yellow-300 font-semibold underline"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Amazing Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search through hundreds of innovative projects from talented women entrepreneurs across Africa
            </p>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            showFilters={true}
            placeholder="Search projects, entrepreneurs, or categories..."
            className="mb-8"
          />

          {searchResults && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Search Results ({searchResults.length} projects found)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover innovative projects from our community of talented women entrepreneurs. 
              These projects are making a real impact across Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/projects"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span>🔍</span>
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How WomenConnect Hub Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From idea to funding - we've streamlined the process to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from women entrepreneurs who have transformed their ideas into thriving businesses through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 italic mb-4">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-blue-600">
                    Project: {testimonial.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Turn Your Vision Into Reality?
          </h2>
          <p className="text-xl text-amber-100 mb-8 leading-relaxed">
            Join thousands of women entrepreneurs who are building the future of Africa. 
            Start your project today and connect with investors who believe in your vision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-amber-800 hover:bg-amber-50 font-bold py-4 px-8 rounded-lg text-lg transition-colors transform hover:scale-105"
            >
              🚀 Start Your Project
            </button>
            <Link
              to="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-amber-800 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              📖 Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      )}

      <Footer />
    </div>
  );
};

export default HomePage;