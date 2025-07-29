import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

const EmailModal = ({ isOpen, onClose, recipient, subject: initialSubject = '' }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    to: recipient?.email || '',
    subject: initialSubject,
    message: '',
    priority: 'normal',
    attachment: ''
  });
  const [sending, setSending] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.to.trim()) {
      errors.to = 'Recipient email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to)) {
      errors.to = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSending(true);
    
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Email sent:', {
        from: user.email,
        to: formData.to,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        timestamp: new Date().toISOString()
      });
      
      // Reset form
      setFormData({
        to: recipient?.email || '',
        subject: '',
        message: '',
        priority: 'normal',
        attachment: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      setValidationErrors({ submit: 'Failed to send email. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Compose Email</h2>
              {recipient && (
                <p className="text-gray-600 mt-1">
                  To: {recipient.name} ({recipient.email})
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {validationErrors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {validationErrors.submit}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To: *
            </label>
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.to ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="recipient@example.com"
            />
            {validationErrors.to && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.to}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject: *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Email subject"
              />
              {validationErrors.subject && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority:
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">🟢 Low</option>
                <option value="normal">🟡 Normal</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message: *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type your message here..."
            />
            {validationErrors.message && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment (Google Drive Link):
            </label>
            <input
              type="url"
              name="attachment"
              value={formData.attachment}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <span>📧</span>
                  Send Email
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;