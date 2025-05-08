import { MessageModel } from "../models/MessageModel.js";

export class ChatController {
  constructor(chatModel) {
    this.chatModel = chatModel;
    this.listeners = [];
  }

  async initialize() {
    try {
      await this.chatModel.initialize();
      if (this.chatModel.conversations.length === 0) {
        this.createNewConversation();
      }
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to initialize ChatController:", error);
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
    const userMessage = new MessageModel(Date.now().toString(), text, "user");
    conversation.addMessage(userMessage);
    this.notifyListeners();

    // Get model to use
    const modelToUse =
      conversation.modelId ||
      (this.chatModel.availableModels.length > 0
        ? this.chatModel.availableModels[0].name
        : "llama2");

    // Get AI response from Ollama
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
      // Add error message
      const errorMessage = new MessageModel(
        Date.now().toString(),
        "Sorry, there was an error processing your request.",
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
}
