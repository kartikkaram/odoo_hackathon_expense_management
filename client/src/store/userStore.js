import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null, // holds the current user

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
