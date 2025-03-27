#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String, vec};

#[test]
fn test_artistic_nft() {
    let env = Env::default();
    let contract_id = env.register(ArtisticNFTContract, ());
    let client = ArtisticNFTContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let organizer = Address::generate(&env);
    let participant1 = Address::generate(&env);
    let participant2 = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Create event
    let art_metadata_url = String::from_str(&env, "https://blockfest.io/art/event123");
    
    env.mock_all_auths();
    
    let event_id = client.create_event(&organizer, &art_metadata_url);
    
    // Enable minting
    client.enable_minting(&event_id, &organizer);
    
    // Batch mint NFTs
    let participants = vec![&env, participant1.clone(), participant2.clone()];
    let nft_ids = client.batch_mint(&event_id, &participants, &organizer);
    
    // Verify NFTs
    let nft1 = client.get_nft(&nft_ids.get(0).unwrap());
    assert_eq!(nft1.owner, participant1);
    assert_eq!(nft1.event_id, event_id);
    assert_eq!(nft1.art_metadata_url, art_metadata_url);
    
    let nft2 = client.get_nft(&nft_ids.get(1).unwrap());
    assert_eq!(nft2.owner, participant2);
    assert_eq!(nft2.event_id, event_id);
    assert_eq!(nft2.art_metadata_url, art_metadata_url);
    
    // Transfer NFT
    let recipient = Address::generate(&env);
    client.transfer_nft(&participant1, &recipient, &nft_ids.get(0).unwrap());
    
    // Verify transfer
    let nft1_after = client.get_nft(&nft_ids.get(0).unwrap());
    assert_eq!(nft1_after.owner, recipient);
} 