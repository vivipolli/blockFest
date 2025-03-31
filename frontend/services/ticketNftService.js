import axios from "axios";
import walletService from "./walletService";

/**
 * Service for interacting with the Ticket NFT contract
 */
class TicketNftService {
  /**
   * Mint a ticket via backend API
   * @param {Object} params - Mint parameters
   * @param {string} params.metadataURL - Ticket metadata URL
   * @param {string} params.userPublicKey - Recipient address
   * @returns {Promise<Object>} Minted ticket information
   */
  async mintTicket({ metadataURL, userPublicKey }) {
    try {
      console.log("Requesting ticket mint with params:", {
        metadataURL,
        userPublicKey,
      });

      if (!metadataURL) {
        throw new Error("Ticket metadata URL is required");
      }

      if (!userPublicKey) {
        throw new Error("Recipient address is required");
      }

      const response = await fetch("/api/mint-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadataURL,
          userPublicKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to mint ticket");
      }

      const result = await walletService.completeTransaction(
        data.transactionXDR
      );

      console.log("Mint successful:", { ...data, transactionResult: result });

      return {
        ...data,
        transactionResult: result,
      };
    } catch (error) {
      console.error("Error minting ticket:", error);
      throw error;
    }
  }
}

export default new TicketNftService();
