import { NextResponse } from "next/server";
import {
  Keypair,
  Contract,
  rpc as StellarRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";
import {
  parseTransactionEvents,
  findTokenIdInMintEvent,
} from "../soroban-utils";

const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;
const CONTRACT_ID = process.env.NEXT_PUBLIC_TICKET_NFT_CONTRACT_ID;
const SOROBAN_RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;

export async function POST(request) {
  try {
    const requestText = await request.text();
    const body = JSON.parse(requestText);

    if (!body || !body.userPublicKey || !body.metadata || !body.image) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const { userPublicKey, metadata, image } = body;

    const adminKeypair = Keypair.fromSecret(ADMIN_SECRET_KEY);
    const server = new StellarRpc.Server(SOROBAN_RPC_URL);
    const contractAddress = CONTRACT_ID;
    const contract = new Contract(contractAddress);

    const sourceAccount = await server.getAccount(adminKeypair.publicKey());
    const userPublicKeyScVal = new StellarSdk.Address(userPublicKey).toScVal();

    const metadataScVal = StellarSdk.xdr.ScVal.scvString(metadata);
    const imageScVal = StellarSdk.xdr.ScVal.scvString(image);

    let builtTransaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call("mint", userPublicKeyScVal, metadataScVal, imageScVal)
      )
      .setTimeout(30)
      .build();

    let preparedTransaction = await server.prepareTransaction(builtTransaction);
    preparedTransaction.sign(adminKeypair);

    let sendResponse = await server.sendTransaction(preparedTransaction);

    if (sendResponse.status === "PENDING") {
      let getResponse = await server.getTransaction(sendResponse.hash);
      while (getResponse.status === "NOT_FOUND") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        getResponse = await server.getTransaction(sendResponse.hash);
      }

      if (getResponse.status === "SUCCESS") {
        const parsedEvents = parseTransactionEvents(getResponse.resultMetaXdr);
        console.log("Parsed events:", JSON.stringify(parsedEvents, null, 2));

        let tokenId = findTokenIdInMintEvent(parsedEvents);
        if (tokenId === null) {
          tokenId = 1;
          console.log(
            "Token ID not found in events, using default value:",
            tokenId
          );
        } else {
          console.log("Found token ID in events:", tokenId);
        }

        console.log("tokenId", tokenId);

        return NextResponse.json({
          success: true,
          tokenId: tokenId,
          mintTransaction: sendResponse.hash,
        });
      } else {
        throw new Error(`Mint transaction failed: ${getResponse.resultXdr}`);
      }
    } else {
      throw new Error(sendResponse.errorResultXdr);
    }
  } catch (error) {
    console.error("Error in minting and transferring ticket:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mint and transfer ticket" },
      { status: 500 }
    );
  }
}
