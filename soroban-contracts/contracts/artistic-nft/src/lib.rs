#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec, vec, Map};

#[contracttype]
#[derive(Clone)]
pub struct ArtisticNFT {
    owner: Address,
    event_id: u64,
    art_metadata_url: String,
    nft_id: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct EventInfo {
    event_id: u64,
    organizer: Address,
    art_metadata_url: String,
    is_minting_enabled: bool,
}

#[contract]
pub struct ArtisticNFTContract;

#[contractimpl]
impl ArtisticNFTContract {
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
        env.storage().instance().set(&Symbol::new(&env, "next_nft_id"), &0u64);
        env.storage().instance().set(&Symbol::new(&env, "next_event_id"), &0u64);
    }

    pub fn create_event(
        env: Env,
        organizer: Address,
        art_metadata_url: String,
    ) -> u64 {
        organizer.require_auth();
        
        // Get next event ID
        let next_event_id: u64 = env.storage().instance().get(&Symbol::new(&env, "next_event_id")).unwrap_or(0);
        
        // Create event info
        let event_info = EventInfo {
            event_id: next_event_id,
            organizer: organizer.clone(),
            art_metadata_url,
            is_minting_enabled: false,
        };
        
        // Store event info
        env.storage().persistent().set(&next_event_id, &event_info);
        
        // Update next event ID
        env.storage().instance().set(&Symbol::new(&env, "next_event_id"), &(next_event_id + 1));
        
        next_event_id
    }
    
    pub fn enable_minting(env: Env, event_id: u64, organizer: Address) {
        organizer.require_auth();
        
        let mut event_info: EventInfo = env.storage().persistent().get(&event_id).unwrap();
        
        // Verify organizer
        if event_info.organizer != organizer {
            panic!("not the event organizer");
        }
        
        // Enable minting
        event_info.is_minting_enabled = true;
        
        // Update storage
        env.storage().persistent().set(&event_id, &event_info);
    }
    
    pub fn batch_mint(
        env: Env,
        event_id: u64,
        participants: Vec<Address>,
        organizer: Address,
    ) -> Vec<u64> {
        organizer.require_auth();
        
        let event_info: EventInfo = env.storage().persistent().get(&event_id).unwrap();
        
        // Verify organizer
        if event_info.organizer != organizer {
            panic!("not the event organizer");
        }
        
        // Verify minting is enabled
        if !event_info.is_minting_enabled {
            panic!("minting not enabled for this event");
        }
        
        let mut nft_ids = vec![&env];
        
        // Get next NFT ID
        let mut next_id: u64 = env.storage().instance().get(&Symbol::new(&env, "next_nft_id")).unwrap_or(0);
        
        // Mint NFTs for all participants
        for participant in participants.iter() {
            // Create NFT
            let nft = ArtisticNFT {
                owner: participant.clone(),
                event_id,
                art_metadata_url: event_info.art_metadata_url.clone(),
                nft_id: next_id,
            };
            
            // Store NFT
            env.storage().persistent().set(&next_id, &nft);
            
            // Add to result list
            nft_ids.push_back(next_id);
            
            // Increment ID
            next_id += 1;
        }
        
        // Update next NFT ID
        env.storage().instance().set(&Symbol::new(&env, "next_nft_id"), &next_id);
        
        nft_ids
    }
    
    pub fn get_nft(env: Env, nft_id: u64) -> ArtisticNFT {
        env.storage().persistent().get(&nft_id).unwrap()
    }
    
    pub fn transfer_nft(env: Env, from: Address, to: Address, nft_id: u64) {
        from.require_auth();
        
        let mut nft: ArtisticNFT = env.storage().persistent().get(&nft_id).unwrap();
        
        // Verify ownership
        if nft.owner != from {
            panic!("not the NFT owner");
        }
        
        // Transfer ownership
        nft.owner = to;
        
        // Update storage
        env.storage().persistent().set(&nft_id, &nft);
    }
    
    pub fn get_event_info(env: Env, event_id: u64) -> EventInfo {
        env.storage().persistent().get(&event_id).unwrap()
    }
}

mod test; 