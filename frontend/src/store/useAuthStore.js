import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
   
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    checkAuth: async ()=>{
        set({ isCheckingAuth: true });
        try{
            const response = await axiosInstance.get("/auth/check");
            if (response.status === 200) {
                set({ authUser: response.data });
            } else {
                set({ authUser: null });
            }
        }
        catch (error) {
            console.error("Error checking authentication:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
         
    }
    ,

    signup: async (data)=>{
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/register", data);
            if (response.status === 201) {
               
                set({ authUser: response.data });
                 toast.success("Signup successful!");
            } else {
                throw new Error("Signup failed");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("Signup failed. Please try again.");
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post("/auth/logout");
            if (response.status === 200) {
                set({ authUser: null });
                toast.success("Logged out successfully!");
            } else {
                throw new Error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Logout failed. Please try again.");
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", data);
            if (response.status === 200) {
                set({ authUser: response.data });
                toast.success("Login successful!");
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            set({ isLoggingIn: false });
        }
    },

  updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put("/user/update-image", data);
            if (response.status === 200) {
                set({ authUser: response.data });
                toast.success("Profile updated successfully!");
            } else {
                throw new Error("Profile update failed");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Profile update failed. Please try again.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },


}));



