import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/api/user/all");
      if (response.status === 200) {
        set({ users: response.data });
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/api/message/${userId}`);
      if (response.status === 200) {
        set({ messages: response.data });
      } else {
        throw new Error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser: selectedUser });
  },

  sendMessage: async (messageContent) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("Please select a user to send a message.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/api/message/send/${selectedUser._id}`,
        messageContent
      );

      if (response.status === 201) {
        set({ messages: [...messages, response.data] });
        get().getUsers(); // Refresh users to update last message
      toast.success("Message sent!");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  },

 subscribeToMessages: () => {
  const { selectedUser } = get();
  if (!selectedUser) return;

  const socket = useAuthStore.getState().socket;

  socket.on("newMessage", (newMessage) => {
    const isFromSelectedUser = newMessage.senderId === selectedUser._id;
    if (isFromSelectedUser) {
      set({
        messages: [...get().messages, newMessage],
      });
    }

    get().getUsers();
  });

  socket.on("messageRead", (data) => {
    get().updateMessageStatus(data);
  });
},


  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    
  },

  markMessagesAsRead: async (messageIds) => {
    try {
      await axiosInstance.put("/api/message/mark-read", { messageIds });

      // emit event to sender's socket
      const socket = useAuthStore.getState().socket;
      socket.emit("markAsRead", { messageIds });

      // Optimistically update local state
      set((state) => ({
        messages: state.messages.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, status: "read" } : msg
        ),
      }));
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  },

  updateMessageStatus: (data) => {
    const { messageIds, status } = data;

    set((state) => ({
      messages: state.messages.map((msg) =>
        messageIds.includes(msg._id) ? { ...msg, status } : msg
      ),
    }));
  },
}));
