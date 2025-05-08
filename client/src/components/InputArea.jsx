import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export const InputArea = ({ value, onChange, onSend, disabled = false }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 to-transparent h-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-300 flex items-center px-3 shadow-sm">
            <input
              ref={inputRef}
              type="text"
              placeholder={disabled ? "Connecting to Ollama..." : "Message Ollama..."}
              className="flex-1 py-3 px-1 focus:outline-none"
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
            <button 
              onClick={onSend}
              disabled={disabled || !value.trim()}
              className={`p-1 rounded-md ${
                disabled || !value.trim() ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            Running on local Ollama models. Responses are generated locally on your machine.
          </div>
        </div>
      </div>
    </>
  );
};