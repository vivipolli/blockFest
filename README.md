# BlockFest - Decentralized Event Ticketing on Stellar

![BlockFest Logo](public/logo.png)

## Project Overview 🌟

BlockFest is a decentralized event ticketing platform built on the Stellar blockchain. Our platform addresses the significant challenges in the traditional event ticketing industry, including ticket fraud, scalping, lack of transparency, and limited engagement between event organizers and attendees.

### Problem Statement

The traditional event ticketing industry faces several challenges:

1. **Ticket Fraud**: Counterfeit tickets and scams are prevalent in the secondary market
2. **Scalping**: Automated bots purchase tickets in bulk for resale at inflated prices
3. **Lack of Transparency**: Limited visibility into ticket authenticity and transaction history
4. **Limited Engagement**: Few opportunities for ongoing connection between organizers and attendees
5. **High Fees**: Centralized platforms charge substantial fees to both organizers and attendees

BlockFest leverages Stellar's fast, low-cost blockchain infrastructure to create a transparent, secure, and engaging ticketing ecosystem that benefits both event organizers and attendees.

## Features ✨

- **Decentralized NFT Ticketing**: Issue and manage event tickets as NFTs on the blockchain, providing a unique and verifiable proof of attendance.
- **Collection NFT Marketplace**: A dedicated marketplace for trading and showcasing event-related collection NFTs, enhancing visibility and engagement within the ecosystem.
- **User Profiles**: Manage user profiles with NFT collections and event history.
- **Web3 Event Creation**: Facilitate the creation of Web3 events on the platform, ensuring community engagement and secure ticket sales through Stellar's capabilities.

## Technical Architecture 🏗️

BlockFest is built using a modern tech stack that leverages the power of Stellar blockchain:

### Frontend

- **Next.js**: React framework for server-rendered applications
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **React Query**: Data fetching and state management
- **Stellar Wallets Kit**: Integration with multiple Stellar wallets (Freighter, Albedo, xBull, WalletConnect)

### Backend

- **Next.js API Routes**: Serverless functions for backend operations
- **Stellar SDK**: JavaScript library for interacting with the Stellar network
- **IPFS/Pinata**: Decentralized storage for NFT metadata

### Blockchain

- **Stellar Network**: Fast, low-cost blockchain infrastructure
- **Stellar Asset Issuance**: Creating and managing NFT tickets as Stellar assets
- **Stellar Smart Contracts**: For advanced ticketing features and marketplace functionality

### Architecture Diagram

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│     Frontend      │      │      Backend      │      │     Blockchain    │
│                   │      │                   │      │                   │
│  ┌─────────────┐  │      │  ┌─────────────┐  │      │  ┌─────────────┐  │
│  │   Next.js   │──┼──────┼─▶│  API Routes │──┼──────┼─▶│   Stellar   │  │
│  └─────────────┘  │      │  └─────────────┘  │      │  │   Network   │  │
│         │         │      │         │         │      │  └─────────────┘  │
│         ▼         │      │         ▼         │      │         ▲         │
│  ┌─────────────┐  │      │  ┌─────────────┐  │      │         │         │
│  │   Wallet    │  │      │  │    IPFS     │  │      │         │         │
│  │ Integration │  │      │  │   Storage   │  │      │         │         │
│  └─────────────┘  │      │  └─────────────┘  │      │         │         │
│         │         │      │                   │      │         │         │
└─────────┼─────────┘      └───────────────────┘      └─────────┼─────────┘
          │                                                      │
          └──────────────────────────────────────────────────────┘
```

## Implementation Details 💻

### NFT Ticket Issuance

BlockFest uses Stellar's native asset issuance capabilities to create NFT tickets:

1. **Ticket Creation**: When an organizer creates an event, the platform generates a unique asset code for each ticket type
2. **Metadata Storage**: Ticket details (event info, seat, etc.) are stored on IPFS via Pinata
3. **Asset Issuance**: A unique Stellar asset is created with the IPFS hash in the asset metadata
4. **Distribution**: When purchased, the NFT ticket is transferred to the buyer's Stellar wallet

```javascript
// Example of NFT ticket issuance
const issuerKeypair = Keypair.fromSecret(process.env.ISSUER_SECRET_KEY);
const nftAsset = new Asset("TBF", issuerKeypair.publicKey());

// Create transaction with payment operation (NFT transfer)
const transaction = new TransactionBuilder(issuerAccount, {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(
    Operation.payment({
      destination: userPublicKey,
      asset: nftAsset,
      amount: "0.0000001", // Minimum amount for NFT
    })
  )
  .setTimeout(30)
  .build();
```

### Wallet Integration

BlockFest integrates with multiple Stellar wallets using the Stellar Wallets Kit:

```javascript
const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: XBULL_ID,
  modules: [
    new xBullModule(),
    new FreighterModule(),
    new AlbedoModule(),
    new LedgerModule(),
    new WalletConnectModule({
      projectId: process.env.WALLET_CONNECT_PROJECT_ID,
      // Other configuration...
    }),
  ],
});
```

### Transaction Signing Flow

1. Backend prepares the transaction and signs with the issuer key
2. Frontend receives the transaction XDR
3. User signs the transaction using their wallet
4. Signed transaction is submitted to the Stellar network

```javascript
// Backend prepares and signs transaction
transaction.sign(issuerKeypair);
const transactionXDR = transaction.toXDR();

// Frontend gets user signature and submits
const { signedTxXdr } = await walletKit.signTransaction(transactionXDR, {
  networkPassphrase: Networks.TESTNET,
});

const server = new Server("https://horizon-testnet.stellar.org");
const result = await server.submitTransaction(
  TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET)
);
```

## Technical Decisions and Justifications 🤔

### Why Stellar?

We chose Stellar for BlockFest for several key reasons:

1. **Low Transaction Costs**: Stellar's minimal fees (0.00001 XLM per operation) make it economically viable for ticketing
2. **Fast Finality**: Transactions confirm in 3-5 seconds, providing immediate ticket delivery
3. **Built-in Asset Issuance**: Native support for creating custom assets, perfect for NFT tickets
4. **Scalability**: Capable of handling 1000+ transactions per second, suitable for high-demand ticket sales
5. **Energy Efficiency**: Stellar's consensus protocol is environmentally friendly compared to proof-of-work blockchains

### Why Next.js?

1. **Server-Side Rendering**: Improves SEO and initial load performance
2. **API Routes**: Simplifies backend development with serverless functions
3. **React Integration**: Leverages the robust React ecosystem
4. **TypeScript Support**: Enhances code quality and developer experience

### Why IPFS/Pinata for Metadata?

1. **Decentralization**: Ensures ticket metadata persists independently of our platform
2. **Content Addressing**: IPFS's content-based addressing ensures data integrity
3. **Pinata Service**: Provides reliable pinning to keep metadata accessible

## Team Experience with Stellar 👨‍💻

Our team has extensive experience with Stellar development:

- **Previous Projects**: Developed multiple applications using Stellar's asset issuance and payment capabilities
- **Community Involvement**: Active participation in Stellar's developer community and hackathons
- **Technical Expertise**: Deep understanding of Stellar's transaction model, operations, and best practices

## Deployment and Testing Instructions 🚀

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A Stellar wallet (Freighter, Albedo, xBull, etc.)
- Testnet XLM (available from [Stellar Laboratory](https://laboratory.stellar.org/))

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/blockfest.git
cd blockfest
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   Create a `.env.local` file with the following variables:

```
# Pinata Configuration (for IPFS storage)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key

# Stellar Configuration
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Admin/Issuer Account (only for development)
NEXT_PUBLIC_ADMIN_PUBLIC_KEY=your_admin_public_key
```

> **Note**: Never commit your `.env.local` file or expose secret keys in public repositories.

### Running the Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to `http://localhost:3000`

### Testing the Application

1. Connect your Stellar wallet (Freighter recommended for testing)
2. Create an event (if you're an organizer)
3. Purchase a ticket using testnet XLM
4. View your NFT ticket in your wallet or on the platform

## Testing Credentials

For testing the platform, you can use these credentials:

- **Test Organizer Account**:

  - Public Key: `GCFDGPZTMYXGNLZU2JGNMJAV6NBZA2ATASY7ECUVD5HCPBILOLYTGSFY`
  - Secret Key: Available upon request for legitimate testing purposes

- **Test User Account**:
  - Create your own using Stellar Laboratory or any Stellar wallet

## Future Roadmap 🗺️

- **Secondary Market**: Implement a secure P2P marketplace for ticket resale
- **Event Check-in System**: QR code scanning for event entry verification
- **Loyalty Programs**: Reward systems for frequent event attendees
- **Multi-chain Support**: Expand to other blockchain networks
- **Mobile Application**: Native mobile apps for iOS and Android

## Contributing 🤝

We welcome contributions to BlockFest! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get involved.

## License 📄

BlockFest is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Stellar Development Foundation for their amazing blockchain platform
- The open-source community for their invaluable tools and libraries
- All hackathon organizers and participants for their support and feedback
