import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCBW2BLKKO2QEFRMSJPPWCAXKDJDZAKBX3EUK7EH4355UAGADLBLP3GE",
  }
} as const


export interface ArtisticNFT {
  art_metadata_url: string;
  event_id: u64;
  nft_id: u64;
  owner: string;
}


export interface EventInfo {
  art_metadata_url: string;
  event_id: u64;
  is_minting_enabled: boolean;
  organizer: string;
}

export const Errors = {

}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin}: {admin: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_event: ({organizer, art_metadata_url}: {organizer: string, art_metadata_url: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a enable_minting transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  enable_minting: ({event_id, organizer}: {event_id: u64, organizer: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a batch_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  batch_mint: ({event_id, participants, organizer}: {event_id: u64, participants: Array<string>, organizer: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<u64>>>

  /**
   * Construct and simulate a get_nft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_nft: ({nft_id}: {nft_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<ArtisticNFT>>

  /**
   * Construct and simulate a transfer_nft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_nft: ({from, to, nft_id}: {from: string, to: string, nft_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_event_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_event_info: ({event_id}: {event_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<EventInfo>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAC0FydGlzdGljTkZUAAAAAAQAAAAAAAAAEGFydF9tZXRhZGF0YV91cmwAAAAQAAAAAAAAAAhldmVudF9pZAAAAAYAAAAAAAAABm5mdF9pZAAAAAAABgAAAAAAAAAFb3duZXIAAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAACUV2ZW50SW5mbwAAAAAAAAQAAAAAAAAAEGFydF9tZXRhZGF0YV91cmwAAAAQAAAAAAAAAAhldmVudF9pZAAAAAYAAAAAAAAAEmlzX21pbnRpbmdfZW5hYmxlZAAAAAAAAQAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAMY3JlYXRlX2V2ZW50AAAAAgAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEwAAAAAAAAAQYXJ0X21ldGFkYXRhX3VybAAAABAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAOZW5hYmxlX21pbnRpbmcAAAAAAAIAAAAAAAAACGV2ZW50X2lkAAAABgAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAKYmF0Y2hfbWludAAAAAAAAwAAAAAAAAAIZXZlbnRfaWQAAAAGAAAAAAAAAAxwYXJ0aWNpcGFudHMAAAPqAAAAEwAAAAAAAAAJb3JnYW5pemVyAAAAAAAAEwAAAAEAAAPqAAAABg==",
        "AAAAAAAAAAAAAAAHZ2V0X25mdAAAAAABAAAAAAAAAAZuZnRfaWQAAAAAAAYAAAABAAAH0AAAAAtBcnRpc3RpY05GVAA=",
        "AAAAAAAAAAAAAAAMdHJhbnNmZXJfbmZ0AAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZuZnRfaWQAAAAAAAYAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X2V2ZW50X2luZm8AAAAAAAEAAAAAAAAACGV2ZW50X2lkAAAABgAAAAEAAAfQAAAACUV2ZW50SW5mbwAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        create_event: this.txFromJSON<u64>,
        enable_minting: this.txFromJSON<null>,
        batch_mint: this.txFromJSON<Array<u64>>,
        get_nft: this.txFromJSON<ArtisticNFT>,
        transfer_nft: this.txFromJSON<null>,
        get_event_info: this.txFromJSON<EventInfo>
  }
}