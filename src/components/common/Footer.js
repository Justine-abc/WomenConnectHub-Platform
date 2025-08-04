import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 text-white">
      {/* Newsletter Section */}
      <div className="bg-black bg-opacity-10 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Our Latest News</h2>
          <p className="text-lg text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive updates, success stories, and investment opportunities.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex rounded-lg overflow-hidden shadow-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 text-gray-900 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 px-8 py-3 font-semibold transition-colors flex items-center gap-2"
                disabled={isSubscribing}
              >
                <span>✉️</span>
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white text-amber-800 px-4 py-3 rounded-lg font-bold text-xl">
                  WCH
                </div>
                <div>
                  <h3 className="text-xl font-bold">WomenConnect Hub</h3>
                  <p className="text-white text-opacity-80 text-sm">Innovation • Growth • Excellence</p>
                </div>
              </div>
              
              <p className="text-white text-opacity-90 leading-relaxed mb-8 max-w-md">
                Empowering African women entrepreneurs with scalable digital solutions for the future. 
                100% committed to fostering innovation and connecting visionary women with investors 
                who believe in transformative ideas.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-xl font-bold">150+</div>
                  <div className="text-sm text-white text-opacity-80">Women Entrepreneurs</div>
                </div>
                <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-xl font-bold">85+</div>
                  <div className="text-sm text-white text-opacity-80">Funded Projects</div>
                </div>
                <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-xl font-bold">4.9</div>
                  <div className="text-sm text-white text-opacity-80">Success Rating</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white text-opacity-90">
                <span className="text-lg">📍</span>
                <span>Across Africa, Digital First</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/" className="text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform inline-block">Home</a></li>
                <li><a href="/projects" className="text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform inline-block">Projects</a></li>
                <li><a href="/entrepreneurs" className="text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform inline-block">Entrepreneurs</a></li>
                <li><a href="/investors" className="text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform inline-block">Investors</a></li>
                <li><a href="/about" className="text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform inline-block">About Us</a></li>
                <li><a href="/contact" className="text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform inline-block">Contact</a></li>
                <li><a href="/blog" className="text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform inline-block">Blog</a></li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📧</span>
                  <span className="text-white text-opacity-90">info@womenconnecthub.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📞</span>
                  <span className="text-white text-opacity-90">+254 700 123 456</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🕒</span>
                  <span className="text-white text-opacity-90">Mon – Fri, 9AM – 6PM EAT</span>
                </div>
              </div>

              <h5 className="font-semibold mb-4">Follow Us</h5>
              <div className="space-y-2">
                <button className="flex items-center gap-3 text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform">
                  <span>💼</span>
                  <span>LinkedIn</span>
                </button>
                <button className="flex items-center gap-3 text-white text-opacity-80 hover:text-white transition-colors hover:translate-x-1 transform">
                  <span>📺</span>
                  <span>YouTube</span>
                </button>
              </div>

              <div className="mt-8">
                <h6 className="font-medium mb-3">Legal</h6>
                <ul className="space-y-2">
                  <li><a href="/privacy" className="text-white text-opacity-70 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-white text-opacity-70 hover:text-white text-sm transition-colors">Terms & Conditions</a></li>
                  <li><a href="/cookies" className="text-white text-opacity-70 hover:text-white text-sm transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-black bg-opacity-20 py-6 border-t border-white border-opacity-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white text-opacity-80">
            © 2025 WomenConnect Hub. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-white text-opacity-80 text-sm">
              <span>🔒</span>
              SSL Secured
            </span>
            <span className="flex items-center gap-2 text-white text-opacity-80 text-sm">
              <span>✅</span>
              GDPR Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;