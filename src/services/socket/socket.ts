import {BASE_WEBSOCKET_URL, MAX_SOCKET_RECONNECT_COUNT} from "#src/constants/index.js";
import {ConversationMessage} from "#root/src/services/conversation/conversation.js";
import {SocketMessage} from "./types.js";
import {fetchGetAccessTokenForSocket} from "#src/utils/fetch.js";
import {EventType} from "../shared/types/events.js";
class Socket {
  private socket: WebSocket | null = null;
  private token?: string;
  private reconnectCount = 0;
  isConnected: boolean = false;
  constructor() {}

  private forceClosed: boolean = false;
  async connect(isReconnect: boolean = false) {
    const chat = window.getMChat?.();
    if (!this.token) await this.fetchToken();
    const wsUrl = `${BASE_WEBSOCKET_URL}/conversations/${chat?.conversationUuid}/messages/?token=${this.token}`;
    this.socket = new WebSocket(wsUrl);
    this.socket.addEventListener("open", () => {
      this.isConnected = true;
      this.updateConnectionStatus(true);
      this.socket?.send(
        JSON.stringify({
          type: "join_messages"
        })
      );
      chat?.eventEmitter.emit({type: EventType.SOCKET_CONNECTED});

      if (isReconnect) {
        chat?.loadConversationMessages();
        this.reconnectCount++;
      }
    });
    this.socket.onmessage = event => {
      const message: SocketMessage = JSON.parse(event.data);
      this.onMessage(message);
    };
    this.socket.onclose = () => this.onclose();
  }

  updateConnectionStatus(connected: boolean) {}

  onMessage(message: SocketMessage) {
    const chat = window.getMChat?.();
    switch (message.type) {
      case "new_message":
        const newMessage = new ConversationMessage(message.message);
        if (newMessage.type === "USER") return;
        else {
          chat?.addConversationMessage(message.message, {incoming: true});
        }
        break;
      case "ai_response":
        chat?.addConversationMessage(message.message, {incoming: true});
        break;
      case "conversation_status_change":
        chat?.setConversationStatus(message.status);
        chat?.addSystemMessage(message.message);
        break;
      default:
        console.info("modo chat : unknown message type :", message);
    }
  }
  close() {
    this.forceClosed = true;
    this.isConnected = false;
    this.updateConnectionStatus(false);
    this.socket?.close();
    this.token = undefined;
  }
  onclose() {
    const chat = window.getMChat?.();
    this.isConnected = false;
    this.updateConnectionStatus(false);
    chat?.eventEmitter.emit({type: EventType.SOCKET_DISCONNECTED});

    if (this.forceClosed === false) {
      // Reconnect after a delay
      setTimeout(() => {
        if (this.reconnectCount <= MAX_SOCKET_RECONNECT_COUNT) {
          this.connect(true);
        }
      }, 3000);
    }
  }

  async fetchToken() {
    const chat = window.getMChat?.();

    const accessTokenRes = await fetchGetAccessTokenForSocket(chat?.chatbot?.uuid as string, chat?.conversationUuid as string, chat?.user.uuid!);
    this.token = accessTokenRes.access_token;
  }
}

export {Socket};
