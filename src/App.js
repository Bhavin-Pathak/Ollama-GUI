// src/views/App.jsx
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "../src/components/Sidebar";
import { ChatArea } from "../src/components/ChatArea";
import { InputArea } from "../src/components/InputArea";
import { ChatModel } from "../src/models/ChatModel";
import { ChatController } from "../src/controllers/ChatController";

const chatModel = new ChatModel();
const chatController = new ChatController(chatModel);

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize controller
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await chatController.initialize();
        updateStateFromController();
        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setIsInitializing(false);
      }
    };

    initializeApp();

    const handleStateChange = () => {
      updateStateFromController();
    };

    chatController.addListener(handleStateChange);

    return () => {
      chatController.removeListener(handleStateChange);
    };
  }, []);

  const updateStateFromController = () => {
    setConversations(chatController.getAllConversations());
    setActiveConversationId(chatController.getActiveConversation()?.id);
    setMessages(chatController.getConversationMessages() || []);
    setAvailableModels(chatController.getAvailableModels());
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const text = inputValue;
    setInputValue("");

    await chatController.sendMessage(text);
    // State updates are handled by the controller listener
  };

  const handleNewConversation = () => {
    chatController.createNewConversation();
  };

  const handleConversationSelect = (id) => {
    chatController.setActiveConversation(id);
  };

  const handleDeleteConversation = (id) => {
    chatController.deleteConversation(id);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            <Menu size={20} />
          </button>
          <h1 className="ml-4 text-xl font-semibold">Ollama Chat</h1>
          {activeConversationId && (
            <div className="ml-auto text-sm text-gray-500">
              {availableModels.length > 0 &&
                `Using model: ${
                  chatController.getActiveConversation()?.modelId ||
                  availableModels[0].name
                }`}
            </div>
          )}
        </header>

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          onSuggestionClick={handleSuggestionClick}
        />

        {/* Input Area */}
        <InputArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSendMessage}
          disabled={isInitializing || !activeConversationId}
        />
      </div>
    </div>
  );
}

export default App;
