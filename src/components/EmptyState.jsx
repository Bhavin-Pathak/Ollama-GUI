import React from "react";
import { MessageSquare, AlignJustify } from "lucide-react";

export const EmptyState = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      title: "Explain quantum computing in simple terms",
      icon: <MessageSquare />,
    },
    {
      title: "Write a short story about a robot learning to love",
      icon: <AlignJustify />,
    },
    {
      title: "How do I build a REST API with Node.js?",
      icon: <MessageSquare />,
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-4xl font-bold mb-8 text-gray-300">
        Chat with Ollama
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center"
            onClick={() => onSuggestionClick(suggestion.title)}
          >
            <div className="mr-3 text-gray-500">{suggestion.icon}</div>
            <div>{suggestion.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
