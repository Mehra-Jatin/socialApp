import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { get } from "mongoose";

 
export const useChatStore = create((set) => ({
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

}
));

