#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String, vec};

#[test]
fn test_artistic_nft_basic() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ArtisticNFTContract);
    let client = ArtisticNFTContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let organizer = Address::generate(&env);
    
    // Initialize contract with proper auth
    env.mock_all_auths();
    client.initialize(&admin);
    
    // Mint NFTs with proper auth
    env.mock_all_auths();
    let event_id = String::from_str(&env, "event123");
    let participant = Address::generate(&env);
    let participants = vec![&env, participant.clone()];
    
    let nft_ids = client.batch_mint(&event_id, &participants, &organizer);
    
    // Check NFT ownership
    let owner = client.owner_of(&nft_ids.get(0).unwrap());
    assert_eq!(owner, participant);
    
    // Check NFT metadata
    let nft: ArtisticNFT = env.as_contract(&contract_id, || {
        env.storage().persistent().get(&nft_ids.get(0).unwrap()).unwrap()
    });
    assert_eq!(nft.owner, participant);
    assert_eq!(nft.event_id, event_id);
}

#[test]
fn test_batch_mint() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ArtisticNFTContract);
    let client = ArtisticNFTContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let organizer = Address::generate(&env);
    let participant1 = Address::generate(&env);
    let participant2 = Address::generate(&env);
    
    // Initialize contract with proper auth
    env.mock_all_auths();
    client.initialize(&admin);
    
    // Batch mint NFTs with proper auth
    env.mock_all_auths();
    let event_id = String::from_str(&env, "event123");
    let participants = vec![&env, participant1.clone(), participant2.clone()];
    let nft_ids = client.batch_mint(&event_id, &participants, &organizer);
    
    // Check total supply
    let total_supply = client.total_supply();
    assert_eq!(total_supply, 2);
    
    // Verify NFT ownership
    let owner1 = client.owner_of(&nft_ids.get(0).unwrap());
    let owner2 = client.owner_of(&nft_ids.get(1).unwrap());
    assert_eq!(owner1, participant1);
    assert_eq!(owner2, participant2);
    
    // Verify NFT metadata
    let nft1: ArtisticNFT = env.as_contract(&contract_id, || {
        env.storage().persistent().get(&nft_ids.get(0).unwrap()).unwrap()
    });
    let nft2: ArtisticNFT = env.as_contract(&contract_id, || {
        env.storage().persistent().get(&nft_ids.get(1).unwrap()).unwrap()
    });
    
    assert_eq!(nft1.event_id, event_id);
    assert_eq!(nft2.event_id, event_id);
}

#[test]
fn test_transfer_nft() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ArtisticNFTContract);
    let client = ArtisticNFTContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let organizer = Address::generate(&env);
    let participant = Address::generate(&env);
    let recipient = Address::generate(&env);
    
    // Initialize contract with proper auth
    env.mock_all_auths();
    client.initialize(&admin);
    
    // Mint a single NFT with proper auth
    env.mock_all_auths();
    let event_id = String::from_str(&env, "event123");
    let participants = vec![&env, participant.clone()];
    let nft_ids = client.batch_mint(&event_id, &participants, &organizer);
    let nft_id = nft_ids.get(0).unwrap();
    
    // Transfer NFT with proper auth
    env.mock_all_auths();
    client.transfer_nft(&participant, &recipient, &nft_id);
    
    // Check new owner
    let new_owner = client.owner_of(&nft_id);
    assert_eq!(new_owner, recipient);
    
    // Check updated NFT metadata
    let nft: ArtisticNFT = env.as_contract(&contract_id, || {
        env.storage().persistent().get(&nft_id).unwrap()
    });
    assert_eq!(nft.owner, recipient);
    
    // Check updated balances
    let participant_balance = client.balance(&participant);
    let recipient_balance = client.balance(&recipient);
    assert_eq!(participant_balance, 0);
    assert_eq!(recipient_balance, 1);
} 