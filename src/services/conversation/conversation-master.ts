import {Conversation, ConversationMessage} from "./conversation.js";

class ConversationMaster {
  conversation?: Conversation;
  fileMaster: CMFileMaster;
  replyMaster: CMReplyMaster;
  constructor() {
    this.fileMaster = new CMFileMaster();
    this.replyMaster = new CMReplyMaster();
  }
  get replyingTo() {
    return this.replyMaster.replyingTo;
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
