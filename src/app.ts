import {EventEmitter} from "./services/emitter/event-emitter";
import {Chatbot} from "./services/chatbot/model";
import {Conversation} from "./services/conversation/conversation";
import {ConversationMaster} from "./services/conversation/conversation-master";
import {Socket} from "./services/socket/socket";
import {User} from "./services/user/model";
import {AppOptions} from "./types/app";
import {EventListener, EventType, ChatEvent} from "./services/shared/types/events";

class ChatClient {
  conversationM: ConversationMaster;
  socket: Socket;
  chatbot: Chatbot;
  user: User;
  eventEmitter: EventEmitter;

  constructor({chatbotUuid, userData, conversationUUid}: AppOptions) {
    this.conversationM = new ConversationMaster(conversationUUid);
    this.socket = new Socket();
    this.chatbot = new Chatbot(chatbotUuid);
    this.user = new User(userData);
    this.eventEmitter = new EventEmitter();
  }

  get conversation() {
    return this.conversationM.conversation;
  }
  get conversationUuid() {
    return this.conversation?.uuid;
  }
  get conversationMessages() {
    return this.conversation?.messages;
  }
  loadConversationMessages() {
    return this.conversation?.loadMessages();
  }
  addConversationMessage(...args: Parameters<Conversation["addMessage"]>) {
    return this.conversation?.addMessage(...args);
  }
  setConversationStatus(...args: Parameters<Conversation["setStatus"]>) {
    return this.conversation?.setStatus(...args);
  }
  addSystemMessage(...args: Parameters<Conversation["addSystemMessage"]>) {
    return this.conversation?.addSystemMessage(...args);
  }

  // event emitter
  on<T extends EventType>(eventType: T, listener: EventListener<Extract<ChatEvent, {type: T}>>): () => void {
    return this.eventEmitter.on(eventType, listener);
  }

  once<T extends EventType>(eventType: T, listener: EventListener<Extract<ChatEvent, {type: T}>>): () => void {
    return this.eventEmitter.once(eventType, listener);
  }

  off<T extends EventType>(eventType: T, listener: EventListener<Extract<ChatEvent, {type: T}>>): void {
    this.eventEmitter.off(eventType, listener);
  }

  onAny(listener: EventListener): () => void {
    return this.eventEmitter.onAny(listener);
  }

  offAny(listener: EventListener): void {
    this.eventEmitter.offAny(listener);
  }
}

export {ChatClient};
