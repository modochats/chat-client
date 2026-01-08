import {EventEmitter} from "./services/emitter/event-emitter";
import {Chatbot} from "./services/chatbot/model";
import {Conversation} from "./services/chat/conversation.model";
import {Socket} from "./services/socket/socket";
import {User} from "./services/user/model";
import {AppOptions} from "./types/app";
import {EventListener, EventType, ChatEvent} from "./services/shared/types/events";
import {loadConversation, sendConversationMessage} from "./services/chat/utils";

class ChatClient {
  conversation?: Conversation;
  socket: Socket;
  chatbot: Chatbot;
  user: User;
  eventEmitter: EventEmitter;

  constructor({chatbotUuid, userData, conversationUUid}: AppOptions) {
    this.user = new User(userData);
    this.chatbot = new Chatbot(chatbotUuid);
    this.eventEmitter = new EventEmitter();
    window.getMChat = () => this;
    if (conversationUUid) this.loadConversation(conversationUUid);
    this.socket = new Socket();
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
  sendMessage(...args: Parameters<typeof sendConversationMessage>) {
    return sendConversationMessage(...args);
  }
  loadConversation(...args: Parameters<typeof loadConversation>) {
    return loadConversation(...args);
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
  clearConversation() {
    this.socket.close();
    this.conversation = undefined;
  }
}
export {ChatClient};
