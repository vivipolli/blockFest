import { NextResponse } from "next/server";
import {
  Contract,
  rpc as StellarRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";

const CONTRACT_ID = process.env.NEXT_PUBLIC_TICKET_NFT_CONTRACT_ID;
const SOROBAN_RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userPublicKey = searchParams.get("userPublicKey");

    if (!userPublicKey) {
      return NextResponse.json(
        { error: "Missing required parameter: userPublicKey" },
        { status: 400 }
      );
    }

    const server = new StellarRpc.Server(SOROBAN_RPC_URL);
    const contractAddress = CONTRACT_ID;
    const contract = new Contract(contractAddress);

    // Obtenha a conta do usuário para usar como fonte da transação
    const userAccount = await server.getAccount(userPublicKey);

    // Consulte o contrato para obter o número total de tokens
    const tokenCountTx = new TransactionBuilder(userAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call("token_count"))
      .setTimeout(30)
      .build();

    const tokenCountResult = await server.simulateTransaction(tokenCountTx);
    const tokenCount = parseInt(
      tokenCountResult.result.retval.i128().lo().toString()
    );

    // Verifique cada token para ver se pertence ao usuário
    const userNFTs = [];
    const userAddress = new StellarSdk.Address(userPublicKey).toScVal();

    for (let i = 1; i <= tokenCount; i++) {
      const tokenIdScVal = StellarSdk.xdr.ScVal.scvI128(
        new StellarSdk.xdr.Int128Parts({ lo: BigInt(i), hi: BigInt(0) })
      );

      const ownerTx = new TransactionBuilder(userAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(contract.call("owner_of", tokenIdScVal))
        .setTimeout(30)
        .build();

      const ownerResult = await server.simulateTransaction(ownerTx);
      const ownerAddress = ownerResult.result.retval;

      if (ownerAddress.address().equals(userAddress.address())) {
        // Obtenha metadados e imagem do token
        const metadataTx = new TransactionBuilder(userAccount, {
          fee: BASE_FEE,
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(contract.call("token_uri"))
          .setTimeout(30)
          .build();

        const imageTx = new TransactionBuilder(userAccount, {
          fee: BASE_FEE,
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(contract.call("token_image"))
          .setTimeout(30)
          .build();

        const metadataResult = await server.simulateTransaction(metadataTx);
        const imageResult = await server.simulateTransaction(imageTx);

        userNFTs.push({
          tokenId: i,
          metadata: metadataResult.result.retval.str(),
          image: imageResult.result.retval.str(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      userPublicKey: userPublicKey,
      nfts: userNFTs,
    });
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user NFTs" },
      { status: 500 }
    );
  }
}
