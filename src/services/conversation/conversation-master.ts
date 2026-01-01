import {Conversation, ConversationMessage} from "./conversation.js";
import {loadConversation, sendConversationMessage} from "./utils.js";

class ConversationMaster {
  conversation?: Conversation;
  fileMaster: CMFileMaster;
  replyMaster: CMReplyMaster;
  constructor(uuid?: string) {
    this.fileMaster = new CMFileMaster();
    this.replyMaster = new CMReplyMaster();
    if (uuid) this.loadConversation(uuid);
  }
  get replyingTo() {
    return this.replyMaster.replyingTo;
  }

  sendMessage(...args: Parameters<typeof sendConversationMessage>) {
    return sendConversationMessage(...args);
  }
  loadConversation(...args: Parameters<typeof loadConversation>) {
    return loadConversation(...args);
  }
}
class CMFileMaster {
  file?: File;

  clearFile() {
    this.file = undefined;
  }
  setFile(file: File) {
    this.file = file;
  }
}

class CMReplyMaster {
  replyingTo?: ConversationMessage;

  setReply(message: ConversationMessage) {
    this.replyingTo = message;
  }

  clearReply() {
    this.replyingTo = undefined;
  }
}
export {ConversationMaster};
