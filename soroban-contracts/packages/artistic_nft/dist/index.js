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
        contractId: "CDKENMCEULWNP444N24VUU74IITFA6VSNTKBD6UMDD3MA3YN4JT4YUEO",
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
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAAC0FydGlzdGljTkZUAAAAAAQAAAAAAAAAEGFydF9tZXRhZGF0YV91cmwAAAAQAAAAAAAAAAhldmVudF9pZAAAAAYAAAAAAAAABm5mdF9pZAAAAAAABgAAAAAAAAAFb3duZXIAAAAAAAAT",
            "AAAAAQAAAAAAAAAAAAAACUV2ZW50SW5mbwAAAAAAAAQAAAAAAAAAEGFydF9tZXRhZGF0YV91cmwAAAAQAAAAAAAAAAhldmVudF9pZAAAAAYAAAAAAAAAEmlzX21pbnRpbmdfZW5hYmxlZAAAAAAAAQAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEw==",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAMY3JlYXRlX2V2ZW50AAAAAgAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEwAAAAAAAAAQYXJ0X21ldGFkYXRhX3VybAAAABAAAAABAAAABg==",
            "AAAAAAAAAAAAAAAOZW5hYmxlX21pbnRpbmcAAAAAAAIAAAAAAAAACGV2ZW50X2lkAAAABgAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAKYmF0Y2hfbWludAAAAAAAAwAAAAAAAAAIZXZlbnRfaWQAAAAGAAAAAAAAAAxwYXJ0aWNpcGFudHMAAAPqAAAAEwAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEwAAAAEAAAPqAAAABg==",
            "AAAAAAAAAAAAAAAHZ2V0X25mdAAAAAABAAAAAAAAAAZuZnRfaWQAAAAAAAYAAAABAAAH0AAAAAtBcnRpc3RpY05GVAA=",
            "AAAAAAAAAAAAAAAMdHJhbnNmZXJfbmZ0AAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZuZnRfaWQAAAAAAAYAAAAA",
            "AAAAAAAAAAAAAAAOZ2V0X2V2ZW50X2luZm8AAAAAAAEAAAAAAAAACGV2ZW50X2lkAAAABgAAAAEAAAfQAAAACUV2ZW50SW5mbwAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        create_event: (this.txFromJSON),
        enable_minting: (this.txFromJSON),
        batch_mint: (this.txFromJSON),
        get_nft: (this.txFromJSON),
        transfer_nft: (this.txFromJSON),
        get_event_info: (this.txFromJSON)
    };
}
