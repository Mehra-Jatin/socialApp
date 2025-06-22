import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
   
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    
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

}));



