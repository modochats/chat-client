import {ConversationStatus, MessageType} from "./types.js";
import {fetchConversationMessages, fetchMarkConversationAsRead, fetchMessageFeedback, fetchReadMessage} from "#src/utils/fetch.js";
import {EventType} from "../shared/types/events.js";

class Conversation {
  uuid: string;
  chatbot: number;
  unreadCount: number;
  messages: ConversationMessage[] = [];
  status?: keyof typeof ConversationStatus;
  uniqueId?: string;

  constructor(init: Record<string, any>) {
    this.uuid = init.uuid;
    this.chatbot = init.chatbot;
    this.unreadCount = init.unread_count;
    this.uniqueId = init.unique_id;
    this.setStatus(init.status);
    this.onInit();
  }

  addMessage(init: Record<string, any>, options?: {incoming: boolean}) {
    const chat = window.getMChat?.();
    const message = new ConversationMessage(init);
    this.messages.push(message);
    chat?.eventEmitter.emit({type: EventType.CONVERSATION_MESSAGE, message, incoming: !!options?.incoming});
    if (options?.incoming) {
      this.unreadCount++;
      // if (chat?.isOpen) this.markAsRead();
      // else {
      // }
    }
  }

  addSystemMessage(message: string) {
    const chat = window.getMChat?.();
    chat?.eventEmitter.emit({type: EventType.CONVERSATION_SYSTEM_MESSAGE, message});
  }

  clear() {
    this.messages = [];
  }
  onInit() {}
  setStatus(status: string) {
    switch (status) {
      case "ai_chat":
        this.status = "AI_CHAT";
        break;
      case "supporter_chat":
        this.status = "SUPPORTER_CHAT";
        break;
      case "resolved":
        this.status = "RESOLVED";
        break;
      default:
        this.status = "UNKNOWN";
    }
  }
  async loadMessages() {
    const chat = window.getMChat?.();
    const res = await fetchConversationMessages(this.uuid, chat?.chatbot.uuid as string);
    this.messages = [];
    chat?.eventEmitter.emit({type: EventType.CONVERSATION_MESSAGES_CLEAR});

    for (const message of res.results) this.addMessage(message);
    chat?.eventEmitter.emit({type: EventType.CONVERSATION_MESSAGES_LOAD, messages: this.messages});
    return this.messages;
  }

  async markAsRead() {
    const chat = window.getMChat?.();
    await fetchMarkConversationAsRead(this.uuid, chat?.user.uuid as string);
    this.unreadCount = 0;
  }
}

class ConversationMessage {
  id: number;
  content: string;
  type: keyof typeof MessageType;
  createdAt: string;
  isRead: boolean = false;
  hasFeedback: boolean = false;
  repliedToId?: number;
  fileSrc?: string;
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.content = init.content;
    this.isRead = init.is_read || false;
    switch (init.message_type) {
      case 0:
        this.type = "USER";
        break;
      case 1:
        this.type = "AI";
        break;
      case 2:
        this.type = "SUPPORTER";
        break;
      case 3:
        this.type = "SYSTEM";
        break;
      default:
        this.type = "UNKNOWN";
    }
    this.createdAt = init.created_at;
    if (init.response_to) this.repliedToId = init.response_to;
    if (init.file) this.fileSrc = init.file;
  }

  async fetchRead() {
    if (this.isRead === false && this.type !== "USER") {
      this.isRead = true;
      await fetchReadMessage(this.id);
    }
  }

  async sendFeedBack(liked: boolean) {
    const chat = window.getMChat?.();
    if (this.hasFeedback) return; // Prevent multiple feedback submissions

    this.hasFeedback = true;
    try {
      await fetchMessageFeedback(this.id, chat?.user?.uuid as string, chat?.conversationUuid as string, liked);
    } catch {
      this.hasFeedback = false;
    }
  }

  get repliedTo() {
    const chat = window.getMChat?.();
    const message = chat?.conversationMessages?.find(({id}) => id === this.repliedToId);
    return message;
  }
}
export {Conversation, ConversationMessage};
