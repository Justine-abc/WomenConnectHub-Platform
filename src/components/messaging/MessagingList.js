import React from 'react';

const MessagingList = ({ threads, selectedThread, onThreadSelect, currentUserId, loading }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (thread) => {
    return thread.participants.find(p => p.id !== currentUserId);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return '⚡';
      case 'high': return '🔴';
      case 'normal': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  const truncateMessage = (message, maxLength = 80) => {
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
        <p className="text-gray-500">Your inbox is empty</p>
      </div>
    );
  }

  return (
    <div>
      {threads.map(thread => {
        const otherParticipant = getOtherParticipant(thread);
        const isSelected = selectedThread?.id === thread.id;
        const hasUnread = thread.unreadCount > 0;
        
        return (
          <div
            key={thread.id}
            onClick={() => onThreadSelect(thread)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
              isSelected ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {otherParticipant?.name || 'Unknown User'}
                    </h4>
                    
                    {/* User type badge */}
                    <span className="text-xs">
                      {otherParticipant?.type === 'entrepreneur' ? '👩‍💼' :
                       otherParticipant?.type === 'investor' ? '💼' : '⚙️'}
                    </span>
                    
                    {/* Priority indicator */}
                    {thread.lastMessage?.priority && thread.lastMessage.priority !== 'normal' && (
                      <span className="text-xs">
                        {getPriorityIcon(thread.lastMessage.priority)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Unread count */}
                    {hasUnread && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {thread.unreadCount}
                      </span>
                    )}
                    
                    {/* Timestamp */}
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTime(thread.lastMessage?.timestamp)}
                    </span>
                  </div>
                </div>
                
                {/* Subject */}
                <div className={`text-sm mb-1 truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {thread.subject}
                </div>
                
                {/* Last message preview */}
                <div className={`text-sm truncate ${hasUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                  {thread.lastMessage?.from.id === currentUserId && (
                    <span className="text-gray-400 mr-1">You: </span>
                  )}
                  {truncateMessage(thread.lastMessage?.message || '')}
                </div>
                
                {/* Message status for sent messages */}
                {thread.lastMessage?.from.id === currentUserId && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-400">
                      {thread.lastMessage.status === 'sent' && '✓'}
                      {thread.lastMessage.status === 'delivered' && '✓✓'}
                      {thread.lastMessage.status === 'read' && '✓✓'}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">
                      {thread.lastMessage.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagingList;