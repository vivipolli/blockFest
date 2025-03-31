import { NextResponse } from "next/server";
import {
  Keypair,
  Asset,
  TransactionBuilder,
  Networks,
  Operation,
  BASE_FEE,
} from "@stellar/stellar-sdk";

import { Horizon } from "@stellar/stellar-sdk";

import { extractCIDFromURL } from "@/utils/ipfs";

const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

export async function POST(request) {
  try {
    const requestText = await request.text();
    const body = JSON.parse(requestText);

    if (!body || !body.userPublicKey || !body.metadataURL) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const { userPublicKey, metadataURL } = body;

    const issuerKeypair = Keypair.fromSecret(ADMIN_SECRET_KEY);
    console.log(`Issuer Public Key: ${issuerKeypair.publicKey()}`);

    const nftAsset = new Asset("TBF", issuerKeypair.publicKey());

    const server = new Horizon.Server("https://horizon-testnet.stellar.org");
    const account = await server.loadAccount(issuerKeypair.publicKey());
    const metadataCID = extractCIDFromURL(metadataURL);

    // Build a transaction that mints the NFT.
    let transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      // Add the NFT metadata to the issuer account using a `manageData` operation.
      .addOperation(
        Operation.manageData({
          name: "ipfshash",
          value: metadataCID,
          source: issuerKeypair.publicKey(),
        })
      )
      // Begin sponsoring future reserves for the user
      .addOperation(
        Operation.beginSponsoringFutureReserves({
          sponsoredId: userPublicKey,
          source: issuerKeypair.publicKey(),
        })
      )
      // Create trustline (this will be sponsored)
      .addOperation(
        Operation.changeTrust({
          asset: nftAsset,
          limit: "0.0000001",
          source: userPublicKey,
        })
      )
      // End the sponsorship
      .addOperation(
        Operation.endSponsoringFutureReserves({
          source: userPublicKey,
        })
      )
      // Send the NFT to the user
      .addOperation(
        Operation.payment({
          destination: userPublicKey,
          asset: nftAsset,
          amount: "0.0000001",
          source: issuerKeypair.publicKey(),
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(issuerKeypair);
    const transactionXDR = transaction.toXDR();

    return NextResponse.json({
      success: true,
      assetCode: "TBF",
      issuer: issuerKeypair.publicKey(),
      transactionXDR: transactionXDR,
      metadata: metadataURL,
      metadataCID: metadataCID,
    });
  } catch (error) {
    console.error("Error in minting NFT ticket:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mint NFT ticket" },
      { status: 500 }
    );
  }
}
