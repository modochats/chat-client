import {fetchConversations, fetchSendMessage} from "#root/src/utils/fetch";
import {Conversation} from "./conversation.model";

const sendConversationMessage = async (message: string) => {
  const chat = window.getMChat?.();
  if (chat) {
    const savedFile = chat.chat.fileMaster.file;
    const savedReply = chat.chat.replyMaster.replyingTo?.id;
    const fileSrc = savedFile ? URL.createObjectURL(savedFile) : undefined;
    if (chat?.conversation?.uuid) {
      chat.conversation.addMessage({
        id: "temp",
        content: message,
        message_type: 0,
        created_at: new Date().toISOString(),
        response_to: savedReply,
        file: fileSrc
      });
    }
    chat.chat.fileMaster.clearFile();
    chat.chat.replyMaster.clearReply();
    const sendMsgRes = await fetchSendMessage(chat?.chatbot?.uuid as string, message, chat?.user.uuid, chat?.conversation?.uuid, chat?.user.phoneNumber, {
      file: savedFile,
      replyTo: savedReply
    });

    if (!chat?.conversation?.uuid) {
      chat.chat.conversation = new Conversation(sendMsgRes.conversation);
      chat.conversation?.addMessage(sendMsgRes);
      await chat.socket.connect();
      if (chat.conversation?.status === "AI_CHAT") await chat.conversation.loadMessages();
    }
  } else {
    console.error("Chat instance not found");
  }
};

const loadConversation = async (uuid: string) => {
  const chat = window.getMChat?.();
  if (chat) {
    const res = await fetchConversations(uuid, chat.user.uuid);
    if (res.results.length > 0) {
      chat.chat.conversation = new Conversation(res.results[0]);
    }
  }
};
export {sendConversationMessage, loadConversation};
