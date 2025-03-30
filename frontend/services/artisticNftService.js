import { Client } from "../../soroban-contracts/packages/artistic_nft/dist/index.js";

import SorobanService from "./sorobanService";

/**
 * Service for interacting with the Artistic NFT contract
 */
class ArtisticNftService extends SorobanService {
  constructor() {
    super();
    this.contractId = process.env.NEXT_PUBLIC_ARTISTIC_NFT_CONTRACT_ID;
    this.client = null;
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
      const signedTx = await this.signTransaction(
        await operation.toTransaction()
      );

      return operation.signAndSend(signedTx);
    } catch (error) {
      console.error("Error initializing contract:", error);
      throw error;
    }
  }

  /**
   * Batch mint NFTs for participants
   * @param {string} eventId - Event ID string
   * @param {string[]} participants - Array of participant addresses
   * @param {string} organizer - Organizer address
   * @returns {Promise<number[]>} Array of minted NFT IDs
   */
  async batchMint(eventId, participants, organizer) {
    try {
      const client = await this.getClient();
      const publicKey = await this.getPublicKey();

      const operation = await client.batch_mint({
        event_id: eventId,
        participants,
        organizer: organizer || publicKey,
      });

      const signedTx = await this.signTransaction(
        await operation.toTransaction()
      );
      const result = await operation.signAndSend(signedTx);
      return result.result;
    } catch (error) {
      console.error("Error batch minting NFTs:", error);
      throw error;
    }
  }

  /**
   * Get NFT details
   * @param {number} nftId - NFT ID
   * @returns {Promise<Object>} NFT details
   */
  async getNft(nftId) {
    try {
      const client = await this.getClient();

      const operation = await client.owner_of({ token_id: Number(nftId) });

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
      console.error("Error getting NFT:", error);
      throw error;
    }
  }

  /**
   * Transfer an NFT to another address
   * @param {Object} params - Transfer parameters
   * @param {string} params.to - Recipient address
   * @param {number} params.nftId - NFT ID
   * @returns {Promise<void>}
   */
  async transferNft({ to, nftId }) {
    try {
      const client = await this.getClient();
      const publicKey = await this.getPublicKey();

      const operation = await client.transfer_nft({
        from: publicKey,
        to,
        token_id: Number(nftId),
      });

      const signedTx = await this.signTransaction(
        await operation.toTransaction()
      );
      return operation.signAndSend(signedTx);
    } catch (error) {
      console.error("Error transferring NFT:", error);
      throw error;
    }
  }

  /**
   * Get balance of NFTs for an address
   * @param {string} address - Owner address
   * @returns {Promise<number>} Number of NFTs owned
   */
  async getBalance(address) {
    try {
      const client = await this.getClient();

      const operation = await client.balance({ owner: address });

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
   * Get total supply of NFTs
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

export default new ArtisticNftService();
