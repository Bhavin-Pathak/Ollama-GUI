import React, { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export const InputArea = ({
  value,
  onChange,
  onSend,
  disabled = false,
  ollamaStatus,
  availableModels = [],
  selectedModel = "",
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const getPlaceholderText = () => {
    if (!ollamaStatus?.isRunning) {
      return "Ollama is not running. Please start Ollama...";
    }
    if (disabled) {
      return "Connecting to Ollama...";
    }
    if (availableModels.length === 0) {
      return "No models available. Please pull a model first...";
    }
    return "Type your message here...";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const getStatusDisplay = () => {
    if (!ollamaStatus?.isRunning) {
      return (
        <div className="mb-4 text-center bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium mb-2 text-lg">
            ⚠️ Ollama is not running
          </p>
          <p className="text-gray-700 mb-2">Start Ollama using this command:</p>
          <code className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-teal-600 block mb-2">
            ollama serve
          </code>
        </div>
      );
    }
  };

  const isInputDisabled =
    disabled || !ollamaStatus?.isRunning || availableModels.length === 0;

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 to-transparent h-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8">
        <div className="max-w-3xl mx-auto">
          {getStatusDisplay()}
          <div className="bg-white rounded-xl border border-gray-300 flex items-center px-3 shadow-sm">
            <input
              ref={inputRef}
              type="text"
              placeholder={getPlaceholderText()}
              className="flex-1 py-3 px-1 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              disabled={isInputDisabled}
            />
            <button
              onClick={onSend}
              disabled={isInputDisabled || !value.trim()}
              className={`p-1 rounded-md transition-colors ${
                isInputDisabled || !value.trim()
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
