import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    markMessagesAsRead,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Load messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  // Scroll to bottom & mark as read
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const unreadMessages = messages.filter(
      (msg) => msg.receiverId === authUser._id && msg.status !== "read"
    );

    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map((msg) => msg._id);
      markMessagesAsRead(unreadIds);
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isSender = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isSender
                        ? authUser.profilePicture
                        : selectedUser.profilePicture
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1 flex items-center gap-2">
                <time className="text-xs opacity-50">
                  {formatMessageTime(message.createdAt)}
                </time>

                {isSender && (
                  <span
                    className={`text-xs ${
                      message.status === "read"
                        ? "text-blue-500"
                        : message.status === "delivered"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                    title={message.status}
                  >
                    {message.status === "read"
                      ? "✓✓"
                      : message.status === "delivered"
                      ? "✓✓"
                      : "✓"}
                  </span>
                )}
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
