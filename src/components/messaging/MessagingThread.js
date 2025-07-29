import React from 'react';

const MessagingThread = ({ messages, currentUserId }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getPriorityBadge = (priority) => {
    if (!priority || priority === 'normal') return null;
    
    const badges = {
      urgent: { icon: '⚡', color: 'bg-red-100 text-red-700', label: 'Urgent' },
      high: { icon: '🔴', color: 'bg-orange-100 text-orange-700', label: 'High' },
      low: { icon: '🟢', color: 'bg-green-100 text-green-700', label: 'Low' }
    };
    
    const badge = badges[priority];
    if (!badge) return null;
    
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${badge.color}`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
          <p className="text-gray-500">Send a message to begin chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {date}
            </div>
          </div>
          
          {/* Messages for this date */}
          <div className="space-y-4">
            {dateMessages.map((message, index) => {
              const isFromCurrentUser = message.from.id === currentUserId;
              const showAvatar = index === 0 || 
                dateMessages[index - 1].from.id !== message.from.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isFromCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                    {!isFromCurrentUser && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {message.from.avatar ? (
                          <img 
                            src={message.from.avatar} 
                            alt={message.from.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium text-sm">
                            {message.from.name?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Message content */}
                  <div className={`max-w-xs lg:max-w-md ${isFromCurrentUser ? 'text-right' : 'text-left'}`}>
                    {/* Sender name and priority */}
                    {showAvatar && !isFromCurrentUser && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {message.from.name}
                        </span>
                        {getPriorityBadge(message.priority)}
                      </div>
                    )}
                    
                    {/* Priority for current user messages */}
                    {isFromCurrentUser && getPriorityBadge(message.priority) && (
                      <div className="mb-1">
                        {getPriorityBadge(message.priority)}
                      </div>
                    )}
                    
                    {/* Message bubble */}
                    <div
                      className={`inline-block px-4 py-2 rounded-2xl ${
                        isFromCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      {/* Subject for first message in thread */}
                      {index === 0 && message.subject && !message.subject.startsWith('Re:') && (
                        <div className={`text-sm font-medium mb-2 pb-2 border-b ${
                          isFromCurrentUser ? 'border-blue-400' : 'border-gray-200'
                        }`}>
                          {message.subject}
                        </div>
                      )}
                      
                      {/* Message text */}
                      <div className="whitespace-pre-wrap break-words">
                        {message.message}
                      </div>
                    </div>
                    
                    {/* Timestamp and status */}
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      isFromCurrentUser ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      
                      {/* Status for sent messages */}
                      {isFromCurrentUser && (
                        <span className={`${
                          message.status === 'read' ? 'text-blue-500' : 'text-gray-400'
                        }`}>
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagingThread;