import {Chatbot} from "./services/chatbot/model";
import {Conversation} from "./services/conversation/conversation";
import {ConversationMaster} from "./services/conversation/conversation-master";
import {Socket} from "./services/socket/socket";
import {User} from "./services/user/model";
import {AppOptions} from "./types/app";

class ModoChatClient {
  private conversation: ConversationMaster;
  private socket: Socket;
  chatbot: Chatbot;
  user: User;

  constructor({chatbotUuid, userUuid}: AppOptions) {
    this.conversation = new ConversationMaster();
    this.socket = new Socket();
    this.chatbot = new Chatbot(chatbotUuid);
    this.user = new User(userUuid);
  }
  get conversationUuid() {
    return this.conversation.conversation?.uuid;
  }
  get conversationMessages() {
    return this.conversation.conversation?.messages;
  }

  loadConversationMessages() {
    return this.conversation.conversation?.loadMessages();
  }
  addConversationMessage(...args: Parameters<Conversation["addMessage"]>) {
    return this.conversation.conversation?.addMessage(...args);
  }
  setConversationStatus(...args: Parameters<Conversation["setStatus"]>) {
    return this.conversation.conversation?.setStatus(...args);
  }
  addSystemMessage(...args: Parameters<Conversation["addSystemMessage"]>) {
    return this.conversation.conversation?.addSystemMessage(...args);
  }
}

export {ModoChatClient};
