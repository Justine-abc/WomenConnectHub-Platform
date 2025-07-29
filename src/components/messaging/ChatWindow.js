import React, { useState, useEffect, useRef } from 'react';
import MessagingThread from './MessagingThread';

const ChatWindow = ({ thread, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const otherParticipant = thread.participants.find(p => p.id !== currentUser.id);

  useEffect(() => {
    scrollToBottom();
  }, [thread.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setLoading(true);
    
    const messageData = {
      id: Date.now(),
      threadId: thread.id,
      from: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        type: currentUser.type,
        avatar: currentUser.profile?.profileImage || ''
      },
      to: otherParticipant,
      subject: `Re: ${thread.subject}`,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
      priority: 'normal'
    };

    try {
      await onSendMessage(messageData);
      setNewMessage('');
      
      // Update thread messages immediately for UI responsiveness
      thread.messages.push(messageData);
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatLastSeen = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.abs(now - date) / (1000 * 60);
    
    if (diffInMinutes < 5) return 'Active now';
    if (diffInMinutes < 60) return `Active ${Math.floor(diffInMinutes)} minutes ago`;
    if (diffInMinutes < 24 * 60) return `Active ${Math.floor(diffInMinutes / 60)} hours ago`;
    return `Last seen ${date.toLocaleDateString()}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {otherParticipant?.avatar ? (
                  <img 
                    src={otherParticipant.avatar} 
                    alt={otherParticipant.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-medium text-lg">
                    {otherParticipant?.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              
              {/* Online status */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            
            {/* User info */}
            <div>
              <h3 className="font-semibold text-gray-900">{otherParticipant?.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {otherParticipant?.type === 'entrepreneur' ? '👩‍💼 Entrepreneur' :
                   otherParticipant?.type === 'investor' ? '💼 Investor' : '⚙️ Admin'}
                </span>
                <span>•</span>
                <span>{formatLastSeen(thread.lastMessage?.timestamp)}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-lg">📞</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-lg">📹</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-lg">ℹ️</span>
            </button>
          </div>
        </div>
        
        {/* Subject */}
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Subject:</span> {thread.subject}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <MessagingThread
          messages={thread.messages}
          currentUserId={currentUser.id}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          {/* Attach button */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-lg">📎</span>
          </button>
          
          {/* Message input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            
            {/* Character count */}
            <div className="text-right text-xs text-gray-400 mt-1">
              {newMessage.length}/1000
            </div>
          </div>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <span className="text-lg">📤</span>
            )}
          </button>
        </form>
        
        {/* Quick actions */}
        <div className="flex items-center gap-2 mt-2">
          <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
            💼 Share Project
          </button>
          <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
            📅 Schedule Meeting
          </button>
          <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
            📋 Share Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;