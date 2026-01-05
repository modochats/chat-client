import {Conversation, ConversationMessage} from "./conversation.model.js";
import {loadConversation, sendConversationMessage} from "./utils.js";

class Chat {
  conversation?: Conversation;
  fileMaster: CFileMaster;
  replyMaster: CMReplyMaster;
  constructor(uuid?: string) {
    this.fileMaster = new CFileMaster();
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
class CFileMaster {
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
export {Chat};
