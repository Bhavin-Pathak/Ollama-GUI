import { MessageModel } from "../models/MessageModel.js";

export class ChatController {
  constructor(chatModel) {
    this.chatModel = chatModel;
    this.listeners = [];
    this.currentModel = null;
  }

  async initialize() {
    try {
      await this.chatModel.initialize();

      // Set default model
      this.currentModel = this.chatModel.getSelectedModel();

      // Create initial conversation if none exists
      if (this.chatModel.conversations.length === 0) {
        this.createNewConversation("New Chat");
      }

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error("Failed to initialize ChatController:", error);
      throw error;
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  createNewConversation(title = "New Conversation", modelId = null) {
    const conversation = this.chatModel.createConversation(title, modelId);
    this.notifyListeners();
    return conversation;
  }

  setActiveConversation(id) {
    const conversation = this.chatModel.setActiveConversation(id);
    this.notifyListeners();
    return conversation;
  }

  getActiveConversation() {
    return this.chatModel.getActiveConversation();
  }

  getAllConversations() {
    return this.chatModel.getAllConversations();
  }

  getAvailableModels() {
    return this.chatModel.availableModels;
  }

  async sendMessage(text) {
    const conversation = this.chatModel.getActiveConversation();

    if (!conversation) {
      console.error("No active conversation");
      return;
    }

    // Add user message
    const userMessage = new MessageModel(
      Date.now().toString(),
      text,
      "user",
      this.currentModel
    );
    conversation.addMessage(userMessage);
    this.notifyListeners();

    // Get model to use - prioritize currentModel
    const modelToUse =
      this.currentModel ||
      conversation.modelId ||
      (this.chatModel.availableModels.length > 0
        ? this.chatModel.availableModels[0].name
        : "llama2");

    try {
      const aiResponse = await this.chatModel.sendMessageToOllama(
        text,
        modelToUse
      );

      // Add assistant message
      const assistantMessage = new MessageModel(
        Date.now().toString(),
        aiResponse,
        "assistant",
        modelToUse
      );
      conversation.addMessage(assistantMessage);
      this.notifyListeners();

      return assistantMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = new MessageModel(
        Date.now().toString(),
        `Error: ${error.message || "Failed to get response"}`,
        "assistant",
        modelToUse
      );
      conversation.addMessage(errorMessage);
      this.notifyListeners();

      return errorMessage;
    }
  }

  deleteConversation(id) {
    const result = this.chatModel.deleteConversation(id);
    this.notifyListeners();
    return result;
  }

  getConversationMessages(conversationId = null) {
    const convId = conversationId || this.chatModel.activeConversationId;
    const conversation = this.chatModel.getConversationById(convId);
    return conversation ? conversation.getMessages() : [];
  }

  setModel(modelId) {
    try {
      // First try to set the model
      const success = this.chatModel.setSelectedModel(modelId);

      if (success) {
        // Update current model
        this.currentModel = modelId;

        // Update active conversation if it exists
        const conversation = this.chatModel.getActiveConversation();
        if (conversation) {
          conversation.modelId = modelId;
        }
      } else {
        console.warn(`Failed to set model ${modelId}, using fallback model`);
        // Use whatever model ChatModel selected as fallback
        this.currentModel = this.chatModel.getSelectedModel();
      }

      this.notifyListeners();
    } catch (error) {
      console.error("Error setting model:", error);
      // Don't throw, just log and keep current model
    }
  }
}
