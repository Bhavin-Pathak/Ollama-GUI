import React, { useRef, useEffect } from "react";
import { Message } from "./Message";
import { EmptyState } from "./EmptyState";

export const ChatArea = ({ messages, onSuggestionClick }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyState onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col space-y-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
