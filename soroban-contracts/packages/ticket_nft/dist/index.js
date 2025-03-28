import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CB5ZAZ3DGWAUQVVZOOJM6EE6UQLRZLTL42A7ZIAKYSDDS6KF6GWXPM67",
    }
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
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABlRpY2tldAAAAAAABAAAAAAAAAASZXZlbnRfbWV0YWRhdGFfdXJsAAAAAAAQAAAAAAAAAAdpc191c2VkAAAAAAEAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAJdGlja2V0X2lkAAAAAAAABg==",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAALbWludF90aWNrZXQAAAAABQAAAAAAAAACdG8AAAAAABMAAAAAAAAAEmV2ZW50X21ldGFkYXRhX3VybAAAAAAAEAAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEwAAAAAAAAAFcHJpY2UAAAAAAAALAAAAAAAAAAh0b2tlbl9pZAAAABMAAAABAAAABg==",
            "AAAAAAAAAAAAAAAKZ2V0X3RpY2tldAAAAAAAAQAAAAAAAAAJdGlja2V0X2lkAAAAAAAABgAAAAEAAAfQAAAABlRpY2tldAAA",
            "AAAAAAAAAAAAAAAPdHJhbnNmZXJfdGlja2V0AAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAJdGlja2V0X2lkAAAAAAAABgAAAAA=",
            "AAAAAAAAAAAAAAAKdXNlX3RpY2tldAAAAAAAAgAAAAAAAAAJdGlja2V0X2lkAAAAAAAABgAAAAAAAAAEdXNlcgAAABMAAAAA",
            "AAAAAAAAAAAAAAAOaXNfdGlja2V0X3VzZWQAAAAAAAEAAAAAAAAACXRpY2tldF9pZAAAAAAAAAYAAAABAAAAAQ=="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        mint_ticket: (this.txFromJSON),
        get_ticket: (this.txFromJSON),
        transfer_ticket: (this.txFromJSON),
        use_ticket: (this.txFromJSON),
        is_ticket_used: (this.txFromJSON)
    };
}
