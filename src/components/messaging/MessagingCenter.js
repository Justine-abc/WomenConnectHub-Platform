import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import MessagingList from './MessagingList';
import ChatWindow from './ChatWindow';
import ContactModal from './ContactModal';

const MessagingCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactRecipient, setContactRecipient] = useState(null);

  useEffect(() => {
    loadMessages();
  }, [activeTab]);

  const loadMessages = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    const mockMessages = [
      {
        id: 1,
        threadId: 'thread_1',
        from: {
          id: 2,
          name: 'Sarah Wanjiku',
          email: 'sarah@example.com',
          type: 'entrepreneur',
          avatar: ''
        },
        to: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type
        },
        subject: 'Investment Inquiry for EcoFriendly Fashion',
        message: 'Hi! I saw your interest in sustainable fashion projects. Would you like to learn more about my eco-friendly clothing line?',
        timestamp: '2024-03-10T10:30:00Z',
        status: 'unread',
        priority: 'normal'
      },
      {
        id: 2,
        threadId: 'thread_2',
        from: {
          id: 3,
          name: 'John Investor',
          email: 'john@investment.com',
          type: 'investor',
          avatar: ''
        },
        to: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type
        },
        subject: 'Partnership Opportunity',
        message: 'Hello! I\'m interested in discussing a potential partnership for your Smart Agriculture project.',
        timestamp: '2024-03-09T15:45:00Z',
        status: 'read',
        priority: 'high'
      },
      {
        id: 3,
        threadId: 'thread_1',
        from: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type
        },
        to: {
          id: 2,
          name: 'Sarah Wanjiku',
          email: 'sarah@example.com',
          type: 'entrepreneur'
        },
        subject: 'Re: Investment Inquiry for EcoFriendly Fashion',
        message: 'Thank you for reaching out! I\'d love to learn more about your project. Could you share some details about your business model?',
        timestamp: '2024-03-10T11:15:00Z',
        status: 'sent',
        priority: 'normal'
      }
    ];

    // Group messages into threads
    const threadMap = {};
    mockMessages.forEach(message => {
      if (!threadMap[message.threadId]) {
        threadMap[message.threadId] = {
          id: message.threadId,
          participants: [],
          messages: [],
          lastMessage: null,
          unreadCount: 0,
          subject: message.subject.replace('Re: ', '')
        };
      }
      
      threadMap[message.threadId].messages.push(message);
      
      // Add participants
      const participants = threadMap[message.threadId].participants;
      if (!participants.find(p => p.id === message.from.id)) {
        participants.push(message.from);
      }
      if (!participants.find(p => p.id === message.to.id)) {
        participants.push(message.to);
      }
      
      // Update last message
      if (!threadMap[message.threadId].lastMessage || 
          new Date(message.timestamp) > new Date(threadMap[message.threadId].lastMessage.timestamp)) {
        threadMap[message.threadId].lastMessage = message;
      }
      
      // Count unread messages
      if (message.to.id === user.id && message.status === 'unread') {
        threadMap[message.threadId].unreadCount++;
      }
    });

    // Sort messages within threads by timestamp
    Object.values(threadMap).forEach(thread => {
      thread.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    setMessages(mockMessages);
    setThreads(Object.values(threadMap));
    setLoading(false);
  };

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    
    // Mark messages as read
    const updatedMessages = messages.map(msg => 
      msg.threadId === thread.id && msg.to.id === user.id && msg.status === 'unread'
        ? { ...msg, status: 'read' }
        : msg
    );
    setMessages(updatedMessages);
    
    // Update thread unread count
    const updatedThreads = threads.map(t =>
      t.id === thread.id ? { ...t, unreadCount: 0 } : t
    );
    setThreads(updatedThreads);
  };

  const handleSendMessage = async (messageData) => {
    setLoading(true);
    
    // Add message to state
    const newMessage = {
      ...messageData,
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update or create thread
    const existingThread = threads.find(t => t.id === messageData.threadId);
    if (existingThread) {
      const updatedThreads = threads.map(t =>
        t.id === messageData.threadId
          ? {
              ...t,
              lastMessage: newMessage,
              messages: [...t.messages, newMessage]
            }
          : t
      );
      setThreads(updatedThreads);
    } else {
      // Create new thread
      const newThread = {
        id: messageData.threadId,
        participants: [messageData.from, messageData.to],
        messages: [newMessage],
        lastMessage: newMessage,
        unreadCount: 0,
        subject: messageData.subject
      };
      setThreads(prev => [newThread, ...prev]);
    }
    
    setLoading(false);
  };

  const handleNewMessage = () => {
    setContactRecipient(null);
    setShowContactModal(true);
  };

  const filteredThreads = threads.filter(thread => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      thread.subject.toLowerCase().includes(searchLower) ||
      thread.participants.some(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
      ) ||
      thread.lastMessage?.message.toLowerCase().includes(searchLower)
    );
  });

  const getFilteredThreads = () => {
    switch (activeTab) {
      case 'inbox':
        return filteredThreads.filter(thread => 
          thread.lastMessage?.to.id === user.id
        );
      case 'sent':
        return filteredThreads.filter(thread => 
          thread.lastMessage?.from.id === user.id
        );
      case 'unread':
        return filteredThreads.filter(thread => thread.unreadCount > 0);
      default:
        return filteredThreads;
    }
  };

  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: '📥', count: threads.filter(t => t.lastMessage?.to.id === user.id).length },
    { id: 'sent', label: 'Sent', icon: '📤', count: threads.filter(t => t.lastMessage?.from.id === user.id).length },
    { id: 'unread', label: 'Unread', icon: '🔴', count: threads.reduce((sum, t) => sum + t.unreadCount, 0) }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Communicate with entrepreneurs and investors</p>
            </div>
            
            <button
              onClick={handleNewMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>✏️</span>
              New Message
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Message List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
              {/* Tabs */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto">
                <MessagingList
                  threads={getFilteredThreads()}
                  selectedThread={selectedThread}
                  onThreadSelect={handleThreadSelect}
                  currentUserId={user.id}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm h-full">
              {selectedThread ? (
                <ChatWindow
                  thread={selectedThread}
                  currentUser={user}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a message from your inbox to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        recipient={contactRecipient}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MessagingCenter;