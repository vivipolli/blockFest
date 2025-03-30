import { Client } from "../../soroban-contracts/packages/ticket_nft/dist/index.js";
import SorobanService from "./sorobanService";
import axios from "axios";

/**
 * Service for interacting with the Ticket NFT contract
 */
class TicketNftService extends SorobanService {
  constructor() {
    super();
    this.contractId = process.env.NEXT_PUBLIC_TICKET_NFT_CONTRACT_ID;
    this.client = null;
    this.horizonUrl = "https://horizon.stellar.org";
    this.testnetHorizonUrl = "https://horizon-testnet.stellar.org";
  }

  /**
   * Initialize the contract client
   * @returns {Promise<Client>} Initialized client
   */
  async getClient() {
    if (!this.client) {
      this.client = new Client({
        contractId: this.contractId,
        networkPassphrase: this.networkConfig.networkPassphrase,
        rpcUrl: this.networkConfig.rpcUrl,
      });
    }
    return this.client;
  }

  /**
   * Initialize the contract
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      const client = await this.getClient();
      const publicKey = await this.getPublicKey();

      const operation = await client.initialize({ admin: publicKey });
      const signedTx = await this.signTransaction(operation);
      return operation.signAndSend(signedTx);
    } catch (error) {
      console.error("Error initializing contract:", error);
      throw error;
    }
  }

  /**
   * Mint a ticket via backend API
   * @param {Object} params - Mint parameters
   * @param {string} params.metadata - Ticket metadata URL
   * @param {string} params.image - Ticket image URL
   * @param {string} params.recipient - Recipient address
   * @returns {Promise<number>} Minted ticket ID
   */
  async mintTicket({ metadata, image, recipient }) {
    try {
      console.log("Requesting ticket mint with params:", {
        metadata,
        image,
        recipient,
      });

      // Validate parameters
      if (!metadata) {
        throw new Error("Ticket metadata URL is required");
      }

      if (!image) {
        throw new Error("Ticket image URL is required");
      }

      if (!recipient) {
        throw new Error("Recipient address is required");
      }

      // Chamar a API do backend com os parâmetros corretos
      const response = await fetch("/api/mint-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPublicKey: recipient,
          metadata: metadata,
          image: image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to mint ticket");
      }

      console.log("Mint successful:", data);

      return data.tokenId;
    } catch (error) {
      console.error("Error minting ticket:", error);
      throw error;
    }
  }

  /**
   * Get balance of tickets for an address
   * @param {string} address - Owner address
   * @returns {Promise<number>} Number of tickets owned
   */
  async getBalance(address) {
    try {
      const client = await this.getClient();

      const operation = await client.balance({
        owner: address,
      });

      if (typeof operation.call === "function") {
        const result = await operation.call();
        return result.result;
      } else if (typeof operation.simulate === "function") {
        const result = await operation.simulate();
        return result.result;
      } else {
        const result = await operation;
        return result.result || result;
      }
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  /**
   * Get owner of a ticket
   * @param {number} ticketId - Ticket ID
   * @returns {Promise<string>} Owner address
   */
  async getOwnerOf(ticketId) {
    try {
      const client = await this.getClient();

      const operation = await client.owner_of({
        token_id: Number(ticketId),
      });

      if (typeof operation.call === "function") {
        const result = await operation.call();
        return result.result;
      } else if (typeof operation.simulate === "function") {
        const result = await operation.simulate();
        return result.result;
      } else {
        const result = await operation;
        return result.result || result;
      }
    } catch (error) {
      console.error("Error getting owner:", error);
      throw error;
    }
  }

  /**
   * Transfer a ticket to another address
   * @param {Object} params - Transfer parameters
   * @param {number} params.ticketId - Ticket ID
   * @param {string} params.to - Recipient address
   * @returns {Promise<void>}
   */
  async transferTicket({ ticketId, to }) {
    try {
      const client = await this.getClient();
      const publicKey = await this.getPublicKey();

      const operation = await client.transfer({
        from: publicKey,
        to,
        token_id: Number(ticketId),
      });

      const signedTx = await this.signTransaction(operation);
      return operation.signAndSend(signedTx);
    } catch (error) {
      console.error("Error transferring ticket:", error);
      throw error;
    }
  }

  /**
   * Use a ticket
   * @param {number} ticketId - Ticket ID
   * @returns {Promise<void>}
   */
  async useTicket(ticketId) {
    try {
      const client = await this.getClient();

      const operation = await client.use_ticket({
        ticket_id: Number(ticketId),
      });

      const signedTx = await this.signTransaction(operation);
      return operation.signAndSend(signedTx);
    } catch (error) {
      console.error("Error using ticket:", error);
      throw error;
    }
  }

  /**
   * Check if a ticket is used
   * @param {number} ticketId - Ticket ID
   * @returns {Promise<boolean>} Whether the ticket is used
   */
  async isTicketUsed(ticketId) {
    try {
      const client = await this.getClient();

      const operation = await client.is_ticket_used({
        ticket_id: Number(ticketId),
      });

      if (typeof operation.call === "function") {
        const result = await operation.call();
        return result.result;
      } else if (typeof operation.simulate === "function") {
        const result = await operation.simulate();
        return result.result;
      } else {
        const result = await operation;
        return result.result || result;
      }
    } catch (error) {
      console.error("Error checking if ticket is used:", error);
      throw error;
    }
  }

  /**
   * Get total supply of tickets
   * @returns {Promise<number>} Total supply
   */
  async getTotalSupply() {
    try {
      const client = await this.getClient();

      const operation = await client.total_supply();

      if (typeof operation.call === "function") {
        const result = await operation.call();
        return result.result;
      } else if (typeof operation.simulate === "function") {
        const result = await operation.simulate();
        return result.result;
      } else {
        const result = await operation;
        return result.result || result;
      }
    } catch (error) {
      console.error("Error getting total supply:", error);
      throw error;
    }
  }
}

export default new TicketNftService();
