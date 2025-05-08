export class MessageModel {
  constructor(id, text, sender, modelId = null) {
    this.id = id;
    this.text = text;
    this.sender = sender; // 'user' or 'assistant'
    this.timestamp = Date.now();
    this.modelId = modelId; // which model responded (if assistant)
  }
}
