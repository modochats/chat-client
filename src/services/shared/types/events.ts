import {ConversationMessage} from "../../conversation/conversation";

export enum EventType {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  CONNECTION_ERROR,
  CONVERSATION_MESSAGE,
  CONVERSATION_MESSAGES_LOAD,
  CONVERSATION_SYSTEM_MESSAGE,
  CONVERSATION_LOAD
}

export interface BaseEvent {
  type: EventType;
  // timestamp: number;
}

export interface SocketConnectedEvent extends BaseEvent {
  type: EventType.SOCKET_CONNECTED;
}

export interface SocketDisconnectedEvent extends BaseEvent {
  type: EventType.SOCKET_DISCONNECTED;
}

export interface ConversationMessageEvent extends BaseEvent {
  type: EventType.CONVERSATION_MESSAGE;
  message: ConversationMessage;
  incoming: boolean;
}

export interface ConversationMessagesLoadEvent extends BaseEvent {
  type: EventType.CONVERSATION_MESSAGES_LOAD;
  messages: ConversationMessage[];
}

export interface ConversationSystemMessageEvent extends BaseEvent {
  type: EventType.CONVERSATION_SYSTEM_MESSAGE;
  message: string;
}
export interface ConversationLoadEvent extends BaseEvent {
  type: EventType.CONVERSATION_LOAD;
}

export type ChatEvent =
  | SocketConnectedEvent
  | SocketDisconnectedEvent
  | ConversationMessageEvent
  | ConversationMessagesLoadEvent
  | ConversationSystemMessageEvent
  | ConversationLoadEvent;

export type EventListener<T extends ChatEvent = ChatEvent> = (event: T) => void | Promise<void>;

export type EventListenerMap = {
  [K in EventType]?: Set<EventListener<Extract<ChatEvent, {type: K}>>>;
};
