"use client";

import walletService from "../services/walletService";
import useWalletStore from "../store/walletStore";

export function useWallet() {
  const { address, isConnected, isConnecting } = useWalletStore();

  const connect = async () => {
    try {
      await walletService.openWalletModal();
      return useWalletStore.getState().address;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const disconnect = () => {
    walletService.disconnect();
  };

  const signTransaction = async (xdr) => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }
    return walletService.signTransaction(xdr);
  };

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    signTransaction,
  };
}
