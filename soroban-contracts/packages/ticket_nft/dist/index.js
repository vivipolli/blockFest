import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBM4UPJOXAWI5PZEXSQHJFHVJO63LNE3IB44VDKU5J7JPQ57HPTFM2JN",
    },
};
export const Errors = {};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec([
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAABU93bmVyAAAAAAAAAQAAAAsAAAAAAAAAAAAAAApUb2tlbkNvdW50AAAAAAABAAAAAAAAAAlBcHByb3ZhbHMAAAAAAAABAAAACwAAAAAAAAAAAAAACE1ldGFkYXRhAAAAAAAAAAAAAAAFSW1hZ2UAAAA=",
            "AAAAAAAAAAAAAAAIb3duZXJfb2YAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAsAAAABAAAAEw==",
            "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
            "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
            "AAAAAAAAAAAAAAAJdG9rZW5fdXJpAAAAAAAAAAAAAAEAAAAQ",
            "AAAAAAAAAAAAAAALdG9rZW5faW1hZ2UAAAAAAAAAAAEAAAAQ",
            "AAAAAAAAAAAAAAALaXNfYXBwcm92ZWQAAAAAAgAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAsAAAABAAAAAQ==",
            "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAEbWludAAAAAMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAhtZXRhZGF0YQAAABAAAAAAAAAABWltYWdlAAAAAAAAEAAAAAA=",
            "AAAAAAAAAAAAAAAHYXBwcm92ZQAAAAADAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAsAAAAA",
            "AAAAAAAAAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAsAAAAA",
        ]), options);
        this.options = options;
    }
    fromJSON = {
        owner_of: (this.txFromJSON),
        name: (this.txFromJSON),
        symbol: (this.txFromJSON),
        token_uri: (this.txFromJSON),
        token_image: (this.txFromJSON),
        is_approved: (this.txFromJSON),
        transfer: (this.txFromJSON),
        mint: (this.txFromJSON),
        approve: (this.txFromJSON),
        transfer_from: (this.txFromJSON),
    };
}
