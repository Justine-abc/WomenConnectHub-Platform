import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

const ContactModal = ({ isOpen, onClose, recipient, onSendMessage }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }
    
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }

    setLoading(true);
    
    try {
      const messageData = {
        id: Date.now(),
        from: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          avatar: user.profile?.profileImage || ''
        },
        to: {
          id: recipient.id,
          name: recipient.name,
          email: recipient.email,
          type: recipient.type,
          avatar: recipient.avatar || ''
        },
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        timestamp: new Date().toISOString(),
        status: 'sent',
        threadId: `thread_${user.id}_${recipient.id}_${Date.now()}`
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSendMessage) {
        onSendMessage(messageData);
      }
      
      // Reset form
      setFormData({ subject: '', message: '', priority: 'normal' });
      onClose();
      
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Send Message</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          
          {recipient && (
            <div className="mt-4 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {recipient.avatar ? (
                  <img src={recipient.avatar} alt={recipient.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-blue-600 font-medium">
                    {recipient.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{recipient.name}</div>
                <div className="text-sm text-gray-500">
                  {recipient.type === 'entrepreneur' ? '👩‍💼 Entrepreneur' :
                   recipient.type === 'investor' ? '💼 Investor' : '⚙️ Admin'}
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter message subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="normal">🟡 Normal Priority</option>
              <option value="high">🔴 High Priority</option>
              <option value="urgent">⚡ Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.message.length}/1000 characters
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.subject.trim() || !formData.message.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Send Message
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;