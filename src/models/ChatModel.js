import { ConversationModel } from "./ConversationModel";

export class ChatModel {
  constructor() {
    this.conversations = [];
    this.activeConversationId = null;
    this.availableModels = [];
    this.selectedModel = null;
    this.isInitialized = false;
  }

  async initialize() {
    // Prevent multiple initializations
    if (this.isInitialized) {
      return this.availableModels;
    }

    try {
      const models = await this.fetchAvailableModels();
      this.availableModels = models;

      // Set default model if none selected
      if (!this.selectedModel && models.length > 0) {
        this.selectedModel = models[0].name;
      }

      this.isInitialized = true;
      return models;
    } catch (error) {
      console.error("Failed to initialize ChatModel:", error);
      this.isInitialized = false;
      throw error;
    }
  }

  async fetchAvailableModels() {
    try {
      // Ollama API endpoint to list models
      const response = await fetch("http://localhost:11434/api/tags");
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error("Error fetching models from Ollama:", error);
      // Fallback models in case Ollama isn't running
      return [
        { name: "llama2", modified_at: Date.now() },
        { name: "mistral", modified_at: Date.now() },
        { name: "gemma", modified_at: Date.now() },
      ];
    }
  }

  createConversation(title = "New Conversation", modelId = null) {
    const id = Date.now().toString();
    const conversation = new ConversationModel(id, title, modelId);
    this.conversations.push(conversation);
    this.activeConversationId = id;
    return conversation;
  }

  getConversationById(id) {
    return this.conversations.find((conv) => conv.id === id);
  }

  getActiveConversation() {
    return this.getConversationById(this.activeConversationId);
  }

  setActiveConversation(id) {
    this.activeConversationId = id;
    return this.getActiveConversation();
  }

  getAllConversations() {
    return this.conversations;
  }

  async sendMessageToOllama(text, modelName = "llama2") {
    try {
      // Ollama API request
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          prompt: text,
          stream: false,
        }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error communicating with Ollama:", error);
      return `Sorry, I couldn't connect to the Ollama service. Please make sure Ollama is running on your pc with the ${modelName} model pulled.`;
    }
  }

  deleteConversation(id) {
    const index = this.conversations.findIndex((conv) => conv.id === id);
    if (index !== -1) {
      this.conversations.splice(index, 1);

      // If we deleted the active conversation, set a new active one
      if (this.activeConversationId === id) {
        this.activeConversationId =
          this.conversations.length > 0 ? this.conversations[0].id : null;
      }

      return true;
    }
    return false;
  }
  setSelectedModel(modelName) {
    if (!modelName) {
      throw new Error("Model name is required");
    }

    // Handle cases where model isn't pulled yet
    if (this.availableModels.length === 0) {
      console.warn(
        "No models available, accepting requested model:",
        modelName
      );
      this.selectedModel = modelName;
      return true;
    }

    // Verify model exists in available models
    const modelExists = this.availableModels.some(
      (model) => model.name === modelName
    );

    if (!modelExists) {
      console.warn(`Model ${modelName} not found in available models`);
      // Keep current model if one is set
      if (!this.selectedModel && this.availableModels.length > 0) {
        this.selectedModel = this.availableModels[0].name;
      }
      return false;
    }

    this.selectedModel = modelName;
    return true;
  }
  getSelectedModel() {
    return this.selectedModel || this.availableModels[0]?.name || null;
  }
}
