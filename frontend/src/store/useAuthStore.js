import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


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

}));



