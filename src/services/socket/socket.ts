import {BASE_WEBSOCKET_URL} from "#src/constants/index.js";
import {ConversationMessage} from "#root/src/services/conversation/conversation.js";
import {SocketMessage} from "./types.js";
import {fetchGetAccessTokenForSocket} from "#src/utils/fetch.js";
class Socket {
  private socket: WebSocket | null = null;
  private token?: string;
  isConnected: boolean = false;
  constructor() {}

  private forceClosed: boolean = false;
  connect(isReconnect: boolean = false) {
    const chat = window.getMChat?.();
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
      if (isReconnect) chat?.loadConversationMessages();
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
    const chat = window.getMChat?.();
    this.forceClosed = true;
    this.isConnected = false;
    this.updateConnectionStatus(false);
    this.socket?.close();
    localStorage.removeItem(`modo-chat:${chat?.chatbot.uuid}-conversation-access-token`);
  }
  onclose() {
    this.isConnected = false;
    this.updateConnectionStatus(false);
    if (this.forceClosed === false) {
      // Reconnect after a delay
      setTimeout(() => {
        this.connect(true);
      }, 3000);
    }
  }

  async fetchToken() {
    const chat = window.getMChat?.();

    const accessTokenRes = await fetchGetAccessTokenForSocket(chat?.chatbot?.uuid as string, chat?.conversationUuid as string, chat?.user.uuid!);
  }
}

export {Socket};
