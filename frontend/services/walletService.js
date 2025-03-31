import {
  AlbedoModule,
  FreighterModule,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
  xBullModule,
} from "@creit.tech/stellar-wallets-kit";

import {
  WalletConnectAllowedMethods,
  WalletConnectModule,
} from "@creit.tech/stellar-wallets-kit/modules/walletconnect.module";
import { LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger.module";
import useWalletStore from "../store/walletStore";

import { TransactionBuilder } from "@stellar/stellar-sdk";
import { Horizon } from "@stellar/stellar-sdk";

class WalletService {
  constructor() {
    this.kit = null;
    this.address = null;
    this.isConnected = false;
    this.listeners = [];
  }

  /**
   * Initialize the Stellar Wallets Kit
   * @returns {StellarWalletsKit} The initialized kit
   */
  async initialize() {
    if (!this.kit) {
      const kit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWalletId: XBULL_ID,
        openModal: true,
        modules: [
          new xBullModule(),
          new FreighterModule(),
          new AlbedoModule(),
          new LedgerModule(),
          new WalletConnectModule({
            url: "http://localhost:3000",
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
            method: WalletConnectAllowedMethods.SIGN,
            description: `BlockFest is a platform for creating and managing Events NFTs on the Stellar blockchain.`,
            name: "BlockFest",
            icons: ["A LOGO/ICON TO SHOW TO YOUR USERS"],
            network: WalletNetwork.TESTNET,
          }),
        ],
      });

      this.kit = kit;
    }

    return this.kit;
  }

  /**
   * Open the wallet selection modal
   * @returns {Promise<string>} The connected wallet address
   */
  async openWalletModal() {
    this.initialize();
    return new Promise((resolve, reject) => {
      this.kit.openModal({
        onWalletSelected: async (option) => {
          this.kit.setWallet(option.id);
          const { address } = await this.kit.getAddress();
          this.address = address;
          this.isConnected = true;

          // Update Zustand store
          const { connect } = useWalletStore.getState();
          connect(address);

          this.notifyListeners();
          resolve(address);
        },
        onClosed: (err) => {
          reject(err || new Error("Wallet selection cancelled"));
        },
      });
    });
  }

  /**
   * Connect to a specific wallet
   * @param {string} walletId - The wallet ID to connect to
   * @returns {Promise<string>} The connected wallet address
   */
  async connectWallet(walletId) {
    this.initialize();

    try {
      this.kit.setWallet(walletId);
      const { address } = await this.kit.getAddress();
      this.address = address;
      this.isConnected = true;

      // Update Zustand store
      const { connect } = useWalletStore.getState();
      connect(address);

      this.notifyListeners();
      return address;
    } catch (error) {
      console.error(`Error connecting to wallet ${walletId}:`, error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect the current wallet
   */
  disconnect() {
    this.address = null;
    this.isConnected = false;

    // Update Zustand store
    const { disconnect } = useWalletStore.getState();
    disconnect();

    this.notifyListeners();
  }

  /**
   * Sign a transaction using the connected wallet
   * @param {string} xdr - The transaction XDR to sign
   * @returns {Promise<string>} The signed transaction XDR
   */
  async signTransaction(xdr) {
    if (!this.isConnected || !this.address) {
      throw new Error("Wallet not connected");
    }

    this.initialize();

    try {
      // Assume que `this.kit` é uma instância de uma carteira que pode assinar transações
      // e que já está inicializada e conectada.
      const networkPassphrase =
        process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
        "Test SDF Network ; September 2015";

      // Assina a transação usando a carteira conectada e a passphrase da rede
      const { signedTxXdr } = await this.kit.signTransaction(xdr, {
        networkPassphrase: networkPassphrase,
      });

      return signedTxXdr;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  }

  /**
   * Get the current wallet address
   * @returns {string|null} The current wallet address or null if not connected
   */
  getAddress() {
    return this.address;
  }

  /**
   * Check if a wallet is connected
   * @returns {boolean} True if a wallet is connected
   */
  isWalletConnected() {
    return this.isConnected;
  }

  /**
   * Add a listener for wallet connection changes
   * @param {Function} listener - The listener function
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   * @param {Function} listener - The listener function to remove
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * Notify all listeners of a connection change
   */
  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener({
        address: this.address,
        isConnected: this.isConnected,
      });
    });
  }

  /**
   * Send a payment using the connected wallet
   * @param {Object} params - Payment parameters
   * @param {string} params.destination - Destination address
   * @param {string} params.amount - Amount in stroops
   * @param {string} params.asset - Asset code (default: 'native' for XLM)
   * @param {string} params.memo - Optional memo
   * @returns {Promise<Object>} Transaction result
   */
  async sendPayment({ destination, amount, asset = "native", memo = "" }) {
    if (!this.isConnected || !this.address) {
      throw new Error("Wallet not connected");
    }

    this.initialize();

    try {
      // Import required modules from stellar-sdk
      const StellarSdk = require("@stellar/stellar-sdk");
      const { rpc: StellarRpc } = require("@stellar/stellar-sdk");

      // MOCK: Use a fixed organizer address for testing
      // TODO: In production, validate the destination address before proceeding
      const mockOrganizerAddress =
        "GD3R7OSLHW7F3RHQT3RYG4I3BCV2S2X35MEAHYOEHV26CZD5R37CKT35";
      destination = mockOrganizerAddress;

      // Create a server instance
      const server = new StellarRpc.Server(
        process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
          "https://soroban-testnet.stellar.org"
      );

      // Get the account details
      const sourceAccount = await server.getAccount(this.address);

      // Function to format amount correctly
      const formatAmount = (amountInStroops) => {
        // Convert from stroops to XLM
        const xlmAmount = Number(amountInStroops) / 10000000;

        // Convert to string with fixed precision
        const formattedAmount = xlmAmount.toFixed(7);

        // Remove trailing zeros and decimal point if not needed
        return parseFloat(formattedAmount).toString();
      };

      // Create a transaction with a payment operation
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase:
          process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
          StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destination,
            asset:
              asset === "native"
                ? StellarSdk.Asset.native()
                : new StellarSdk.Asset(asset),
            amount: formatAmount(amount),
          })
        )
        .setTimeout(30)
        .build();

      // Sign the transaction using the wallet
      const signedXdr = await this.signTransaction(transaction.toXDR(), {
        networkPassphrase:
          process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
          StellarSdk.Networks.TESTNET,
      });

      // Convert the signed XDR back to a transaction
      const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
          StellarSdk.Networks.TESTNET
      );

      // Send the transaction
      const transactionResult = await server.sendTransaction(signedTransaction);

      if (transactionResult.status !== "PENDING") {
        throw new Error(
          `Transaction failed with status: ${transactionResult.status}`
        );
      }

      const hash = transactionResult.hash;

      // Poll for transaction confirmation
      let getResponse = await server.getTransaction(hash);
      while (getResponse.status === "NOT_FOUND") {
        console.log("Waiting for transaction confirmation...");
        getResponse = await server.getTransaction(hash);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (getResponse.status !== "SUCCESS") {
        throw new Error(`Transaction failed: ${getResponse.resultXdr}`);
      }

      // Return the transaction result
      return {
        hash,
        ledger: getResponse.ledger,
        successful: true,
        amount: (Number(amount) / 10000000).toFixed(7),
        destination,
        memo: memo ? memo : "",
      };
    } catch (error) {
      console.error("Error sending payment:", error);
      throw error;
    }
  }

  async completeTransaction(transactionXDR) {
    if (!this.isConnected || !this.address) {
      throw new Error("Wallet not connected");
    }

    this.initialize();

    try {
      const transaction = TransactionBuilder.fromXDR(
        transactionXDR,
        process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
          "Test SDF Network ; September 2015"
      );

      const { signedTxXdr } = await this.kit.signTransaction(transactionXDR, {
        networkPassphrase:
          process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
          "Test SDF Network ; September 2015",
      });

      const server = new Horizon.Server(
        process.env.NEXT_PUBLIC_HORIZON_URL ||
          "https://horizon-testnet.stellar.org"
      );

      const result = await server.submitTransaction(
        TransactionBuilder.fromXDR(
          signedTxXdr,
          process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
            "Test SDF Network ; September 2015"
        )
      );

      return result;
    } catch (error) {
      console.error("Error completing transaction:", error);
      throw error;
    }
  }
}

const walletService = new WalletService();

export default walletService;
