/**
 * Base service for Soroban contract interactions
 */

import useWalletStore from "../store/walletStore";
import walletService from "./walletService";

class SorobanService {
  constructor(networkConfig) {
    this.networkConfig = networkConfig || {
      networkPassphrase:
        process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
        "Test SDF Network ; September 2015",
      rpcUrl:
        process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
        "https://soroban-testnet.stellar.org:443",
    };
  }

  /**
   * Get wallet public key
   * @returns {Promise<string>} Public key of the connected wallet
   */
  async getPublicKey() {
    try {
      const { address, isConnected } = useWalletStore.getState();

      if (!isConnected || !address) {
        throw new Error(
          "Wallet not connected. Please connect your wallet first."
        );
      }

      return address;
    } catch (error) {
      console.error("Error getting public key:", error);
      throw error;
    }
  }

  /**
   * Check if wallet is connected
   * @returns {boolean} Whether wallet is connected
   */
  isWalletConnected() {
    return walletService.isWalletConnected();
  }

  /**
   * Sign a transaction using the connected wallet
   * @param {Transaction} transaction - Transaction to sign
   * @returns {Promise<Transaction>} Signed transaction
   */
  async signTransaction(transaction) {
    try {
      console.log("Signing transaction in sorobanService:", transaction);

      if (!this.isWalletConnected()) {
        console.log("Wallet not connected, attempting to connect...");
        // Try to connect wallet if not connected
        try {
          await walletService.openWalletModal();
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          throw new Error(
            "Wallet not connected. Please connect your wallet first."
          );
        }
      }

      // Get the XDR representation of the transaction
      console.log("Getting XDR representation...");
      const xdr = transaction.toXDR();
      console.log("XDR:", xdr);

      // Use walletService to sign the transaction
      console.log("Calling walletService.signTransaction...");
      const signedXDR = await walletService.signTransaction(xdr, {
        networkPassphrase: this.networkConfig.networkPassphrase,
      });
      console.log("Signed XDR:", signedXDR);

      // Import needed only when signing
      console.log("Importing TransactionBuilder...");
      const { TransactionBuilder } = await import("@stellar/stellar-sdk");

      console.log("Creating transaction from XDR...");
      const tx = TransactionBuilder.fromXDR(
        signedXDR,
        this.networkConfig.networkPassphrase
      );
      console.log("Transaction created from XDR:", tx);

      return tx;
    } catch (error) {
      console.error("Error signing transaction:", error);
      console.error("Error details:", error.stack);
      throw error;
    }
  }
}

export default SorobanService;
