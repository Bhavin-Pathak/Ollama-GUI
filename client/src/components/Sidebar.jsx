import React from 'react';
import { Plus, MessageSquare, Trash, Settings, LogOut, User } from 'lucide-react';

export const Sidebar = ({ 
  conversations, 
  activeConversationId, 
  onConversationSelect, 
  onNewConversation,
  onDeleteConversation, 
  isSidebarOpen, 
  onToggleSidebar 
}) => {
  // Group conversations by date
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000; // 24 hours in milliseconds
  
  const groupedConversations = {
    today: conversations.filter(conv => conv.createdAt >= today),
    yesterday: conversations.filter(conv => conv.createdAt >= yesterday && conv.createdAt < today),
    older: conversations.filter(conv => conv.createdAt < yesterday)
  };
  
  // Helper to render conversation list items
  const renderConversationItems = (convs) => {
    return convs.map(conv => (
      <div 
        key={conv.id} 
        className={`mx-2 my-1 px-3 py-2 rounded-md cursor-pointer flex items-center justify-between hover:bg-gray-800 group ${
          activeConversationId === conv.id ? 'bg-gray-800' : ''
        }`}
        onClick={() => onConversationSelect(conv.id)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <MessageSquare size={16} className="mr-2 flex-shrink-0 text-gray-400" />
          <span className="truncate">{conv.title || 'Untitled Conversation'}</span>
        </div>
        <button 
          className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteConversation(conv.id);
          }}
        >
          <Trash size={16} />
        </button>
      </div>
    ));
  };
  
  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col h-full`}>
      <div className="flex items-center p-4 border-b border-gray-700">
        <button 
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 w-full"
          onClick={onNewConversation}
        >
          <Plus size={16} />
          <span className="font-medium">New chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {groupedConversations.today.length > 0 && (
          <>
            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Today</div>
            {renderConversationItems(groupedConversations.today)}
          </>
        )}
        
        {groupedConversations.yesterday.length > 0 && (
          <>
            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase mt-3">Yesterday</div>
            {renderConversationItems(groupedConversations.yesterday)}
          </>
        )}
        
        {groupedConversations.older.length > 0 && (
          <>
            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase mt-3">Older</div>
            {renderConversationItems(groupedConversations.older)}
          </>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center p-3 rounded-md hover:bg-gray-800 cursor-pointer">
          <User size={16} className="mr-2" />
          <span>User Account</span>
        </div>
        <div className="flex items-center p-3 rounded-md hover:bg-gray-800 cursor-pointer">
          <Settings size={16} className="mr-2" />
          <span>Settings</span>
        </div>
        <div className="flex items-center p-3 rounded-md hover:bg-gray-800 cursor-pointer">
          <LogOut size={16} className="mr-2" />
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
};