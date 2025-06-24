import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
    users:[],
    messages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get("/user/all");
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
    }
    ,
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/message/${userId}`);
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
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageContent);
            
            if (response.status === 201) {
                set({ messages: [...messages, response.data] });
                toast.success("Message sent successfully!");
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
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

}));

