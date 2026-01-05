import {EventEmitter} from "./services/emitter/event-emitter";
import {Chatbot} from "./services/chatbot/model";
import {Conversation} from "./services/chat/conversation.model";
import {Chat} from "./services/chat/chat.model";
import {Socket} from "./services/socket/socket";
import {User} from "./services/user/model";
import {AppOptions} from "./types/app";
import {EventListener, EventType, ChatEvent} from "./services/shared/types/events";

class ChatClient {
  chat: Chat;
  socket: Socket;
  chatbot: Chatbot;
  user: User;
  eventEmitter: EventEmitter;

  constructor({chatbotUuid, userData, conversationUUid}: AppOptions) {
    this.chat = new Chat(conversationUUid);
    this.socket = new Socket();
    this.chatbot = new Chatbot(chatbotUuid);
    this.user = new User(userData);
    this.eventEmitter = new EventEmitter();
  }

  get conversation() {
    return this.chat.conversation;
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
