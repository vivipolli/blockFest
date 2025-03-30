import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWalletStore = create(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      isConnecting: false,

      setAddress: (address) => set({ address }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setIsConnecting: (isConnecting) => set({ isConnecting }),

      connect: (address) =>
        set({
          address,
          isConnected: true,
          isConnecting: false,
        }),

      disconnect: () =>
        set({
          address: null,
          isConnected: false,
        }),
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
      }),
    }
  )
);

export default useWalletStore;
