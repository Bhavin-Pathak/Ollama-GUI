export class ConversationModel {
  constructor(id, title, modelId = null) {
    this.id = id;
    this.title = title;
    this.messages = [];
    this.modelId = modelId; // default model for this conversation
    this.createdAt = Date.now();
  }

  addMessage(message) {
    this.messages.push(message);
    return message;
  }

  getMessages() {
    return this.messages;
  }
}
