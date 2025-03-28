#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec, vec};

#[contracttype]
#[derive(Clone)]
pub struct ArtisticNFT {
    owner: Address,
    event_id: u64,
    art_metadata_url: String,
    nft_id: u32,
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
        admin.require_auth();
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
        env.storage().instance().set(&Symbol::new(&env, "next_event_id"), &0u64);
        env.storage().instance().set(&Symbol::new(&env, "next_token_id"), &0u32);
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
        
        // Get event info
        let mut event_info: EventInfo = env.storage().persistent().get(&event_id).unwrap();
        
        // Check if organizer is authorized
        if event_info.organizer != organizer {
            panic!("only event organizer can enable minting");
        }
        
        // Enable minting
        event_info.is_minting_enabled = true;
        
        // Update event info
        env.storage().persistent().set(&event_id, &event_info);
    }
    
    pub fn batch_mint(env: Env, event_id: u64, participants: Vec<Address>, organizer: Address) -> Vec<u32> {
        organizer.require_auth();
        
        // Get event info
        let event_info: EventInfo = env.storage().persistent().get(&event_id).unwrap();
        
        // Check if organizer is authorized
        if event_info.organizer != organizer {
            panic!("only event organizer can mint NFTs");
        }
        
        // Check if minting is enabled
        if !event_info.is_minting_enabled {
            panic!("minting not enabled for this event");
        }
        
        // Mint NFTs for each participant
        let mut nft_ids = vec![&env];
        
        for participant in participants.iter() {
            // Mint a new NFT token
            let token_id = mint_token(&env);
            
            // Create NFT metadata
            let nft = ArtisticNFT {
                owner: participant.clone(),
                event_id,
                art_metadata_url: event_info.art_metadata_url.clone(),
                nft_id: token_id,
            };
            
            // Store NFT metadata
            env.storage().persistent().set(&token_id, &nft);
            
            // Add token ID to result
            nft_ids.push_back(token_id);
        }
        
        nft_ids
    }
    
    pub fn transfer_nft(env: Env, from: Address, to: Address, token_id: u32) {
        from.require_auth();
        
        // Get NFT metadata
        let nft: ArtisticNFT = env.storage().persistent().get(&token_id).unwrap();
        
        // Check if sender is the owner
        if nft.owner != from {
            panic!("not the owner");
        }
        
        // Update NFT metadata
        let updated_nft = ArtisticNFT {
            owner: to,
            event_id: nft.event_id,
            art_metadata_url: nft.art_metadata_url,
            nft_id: nft.nft_id,
        };
        
        // Update NFT metadata
        env.storage().persistent().set(&token_id, &updated_nft);
    }
    
    // Basic NFT functions
    pub fn balance(env: Env, owner: Address) -> u32 {
        let mut count = 0;
        let total = ArtisticNFTContract::total_supply(env.clone());
        
        for i in 0..total {
            let token_id = i;
            if let Some(nft) = env.storage().persistent().get::<u32, ArtisticNFT>(&token_id) {
                if nft.owner == owner {
                    count += 1;
                }
            }
        }
        
        count
    }
    
    pub fn owner_of(env: Env, token_id: u32) -> Address {
        let nft: ArtisticNFT = env.storage().persistent().get(&token_id).unwrap();
        nft.owner
    }
    
    pub fn total_supply(env: Env) -> u32 {
        env.storage().instance().get(&Symbol::new(&env, "next_token_id")).unwrap_or(0)
    }
    
    pub fn token_by_index(env: Env, index: u32) -> u32 {
        // Verifica se o índice é válido
        let total = ArtisticNFTContract::total_supply(env.clone());
        if index >= total {
            panic!("Index out of bounds");
        }
        
        // Retorna o token ID correspondente ao índice
        // Nesta implementação simples, o índice é igual ao token ID
        index
    }
    
    pub fn approve(env: Env, owner: Address, approved: Address, token_id: u32, expiration_ledger: u32) {
        owner.require_auth();
        
        // Verifica se o remetente é o dono
        let nft: ArtisticNFT = env.storage().persistent().get(&token_id).unwrap();
        if nft.owner != owner {
            panic!("Not the owner");
        }
        
        // Armazena a aprovação usando o token_id como parte da chave
        let approval_prefix = Symbol::new(&env, "approval");
        let key = (approval_prefix.clone(), token_id);
        env.storage().temporary().set(&key, &approved);
        env.storage().temporary().extend_ttl(&key, expiration_ledger, expiration_ledger);
    }
    
    pub fn get_approved(env: Env, token_id: u32) -> Option<Address> {
        let approval_prefix = Symbol::new(&env, "approval");
        env.storage().temporary().get(&(approval_prefix, token_id))
    }
    
    pub fn burn(env: Env, from: Address, token_id: u32) {
        from.require_auth();
        
        // Get NFT metadata
        let nft: ArtisticNFT = env.storage().persistent().get(&token_id).unwrap();
        
        // Check if sender is the owner
        if nft.owner != from {
            panic!("not the owner");
        }
        
        // Remove NFT
        env.storage().persistent().remove(&token_id);
    }
}

// Helper functions
fn mint_token(env: &Env) -> u32 {
    // Get next token ID
    let next_token_id: u32 = env.storage().instance().get(&Symbol::new(env, "next_token_id")).unwrap_or(0);
    
    // Increment counter
    env.storage().instance().set(&Symbol::new(env, "next_token_id"), &(next_token_id + 1));
    
    next_token_id
}

mod test; 