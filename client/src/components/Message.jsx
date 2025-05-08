import React from 'react';
import { User, Bot } from 'lucide-react';

export const Message = ({ message }) => {
  return (
    <div className={`py-5 flex ${message.sender === 'assistant' ? 'bg-gray-50' : ''}`}>
      <div className="flex-shrink-0 mr-4">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          message.sender === 'assistant' ? 'bg-green-500' : 'bg-gray-300'
        }`}>
          {message.sender === 'assistant' ? (
            <Bot size={16} className="text-white" />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1">
          {message.sender === 'assistant' ? (
            <>
              Assistant
              {message.modelId && <span className="text-xs ml-2 text-gray-500">({message.modelId})</span>}
            </>
          ) : (
            'You'
          )}
        </div>
        <div className="whitespace-pre-wrap">{message.text}</div>
      </div>
    </div>
  );
};