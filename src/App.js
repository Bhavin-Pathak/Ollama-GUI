import React, { useState, useEffect, useCallback } from "react";
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
  const [ollamaStatus, setOllamaStatus] = useState({
    isRunning: false,
    checking: true,
    error: null,
  });
  const [selectedModel, setSelectedModel] = useState("");

  // Check Ollama Status Function with useCallback
  const checkOllamaStatus = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:11434/api/tags");
      if (response.ok) {
        const data = await response.json();
        const models = data.models || [];
        setAvailableModels(models);

        if (models.length > 0 && !selectedModel) {
          setSelectedModel(models[0].name);
          chatController.setModel(models[0].name);
        }

        setOllamaStatus({
          isRunning: true,
          checking: false,
          error: null,
        });
        return true;
      }
    } catch (error) {
      setOllamaStatus({
        isRunning: false,
        checking: false,
        error:
          "Ollama is not running. Please start Ollama using 'ollama serve' command. in your terminal.",
      });
      setAvailableModels([]);
      return false;
    }
  }, [selectedModel]);

  // Initialize controller with updated dependency array
  useEffect(() => {
    const initializeApp = async () => {
      const isOllamaRunning = await checkOllamaStatus();

      if (isOllamaRunning) {
        try {
          await chatController.initialize();
          updateStateFromController();
          setIsInitializing(false);
        } catch (error) {
          console.error("Failed to initialize app:", error);
          setIsInitializing(false);
          setOllamaStatus((prev) => ({
            ...prev,
            error: "Failed to initialize the application. Please try again.",
          }));
        }
      }
    };

    initializeApp();

    const statusInterval = setInterval(checkOllamaStatus, 5000);
    const handleStateChange = () => updateStateFromController();
    chatController.addListener(handleStateChange);
    console.log("App initialized and listener added");

    return () => {
      clearInterval(statusInterval);
      chatController.removeListener(handleStateChange);
    };
  }, [checkOllamaStatus]);

  const updateStateFromController = useCallback(() => {
    console.log("updateStateFromController: Updating state from controller");
    setConversations(chatController.getAllConversations());
    setActiveConversationId(chatController.getActiveConversation()?.id);
    setMessages(chatController.getConversationMessages() || []);
    setAvailableModels(chatController.getAvailableModels());
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    const text = inputValue;
    setInputValue("");
    await chatController.sendMessage(text);
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

  const handleModelSelect = (modelName) => {
    setSelectedModel(modelName);
    chatController.setModel(modelName);
  };

  const StatusScreen = () => (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md p-6 bg-white rounded-xl shadow-xl">
        <h2
          className={`text-xl font-semibold mb-4 ${
            ollamaStatus.error ? "text-red-600" : "text-green-600"
          }`}
        >
          {ollamaStatus.checking
            ? "Checking Ollama Status..."
            : ollamaStatus.error
            ? "Error"
            : "Ollama is Running"}
        </h2>

        {ollamaStatus.error ? (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm text-red-700 mb-2">
                  {ollamaStatus.error}
                </p>
                <button
                  onClick={checkOllamaStatus}
                  className="mt-6 mx-auto block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        ) : (
          !ollamaStatus.checking && (
            <div className="rounded-xl border border-green-300 bg-green-50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 mt-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-sm text-green-700">
                  Ollama is running and ready to use.
                  {availableModels.length > 0 &&
                    ` Found ${availableModels.length} models.`}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

  if (ollamaStatus.checking || ollamaStatus.error) {
    return <StatusScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-gray-200 flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            <Menu size={20} />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-green-600 font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Ollama is running chat with local models
          </h1>
          {activeConversationId && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500">Current Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => handleModelSelect(e.target.value)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
              >
                {availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        <ChatArea
          messages={messages}
          onSuggestionClick={handleSuggestionClick}
        />

        <InputArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onSend={handleSendMessage}
          disabled={isInitializing || !activeConversationId}
          ollamaStatus={ollamaStatus}
          availableModels={availableModels}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
        />
      </div>
    </div>
  );
}

export default App;
