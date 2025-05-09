export class ConversationModel {
  constructor(id, title = "", modelId = null) {
    this.id = id;
    this.title = title;
    this.modelId = modelId;
    this.messages = [];
    this.createdAt = Date.now();
  }

  addMessage(message) {
    this.messages.push(message);
  }

  getMessages() {
    return this.messages;
  }
}
