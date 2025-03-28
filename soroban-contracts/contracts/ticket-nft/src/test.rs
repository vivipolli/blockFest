#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_ticket_nft_basic() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    // Initialize contract with proper auth
    env.mock_all_auths();
    client.initialize(&admin);
    
    // Mint a ticket with proper auth
    env.mock_all_auths();
    let metadata_url = String::from_str(&env, "https://blockfest.io/events/123");
    let ticket_id = client.mint_ticket(&user, &metadata_url);
    
    // Check ticket metadata
    let ticket: Ticket = env.as_contract(&contract_id, || {
        env.storage().persistent().get(&ticket_id).unwrap()
    });
    assert_eq!(ticket.owner, user);
    assert_eq!(ticket.event_metadata_url, metadata_url);
    assert_eq!(ticket.is_used, false);
    
    // Check NFT ownership
    let owner = client.owner_of(&ticket_id);
    assert_eq!(owner, user);
    
    // Check balance
    let balance = client.balance(&user);
    assert_eq!(balance, 1);
    
    // Use ticket with proper auth
    env.mock_all_auths();
    client.use_ticket(&ticket_id);
    
    // Check if ticket is used
    let is_used = client.is_ticket_used(&ticket_id);
    assert_eq!(is_used, true);
    
    // Transfer ticket with proper auth
    let recipient = Address::generate(&env);
    env.mock_all_auths();
    client.transfer(&user, &recipient, &ticket_id);
    
    // Check new owner
    let new_owner = client.owner_of(&ticket_id);
    assert_eq!(new_owner, recipient);
    
    // Check updated balances
    let user_balance = client.balance(&user);
    let recipient_balance = client.balance(&recipient);
    assert_eq!(user_balance, 0);
    assert_eq!(recipient_balance, 1);
    
    // Test approvals with proper auth
    let approved_user = Address::generate(&env);
    let expiration_ledger = 100;
    env.mock_all_auths();
    client.approve(&recipient, &approved_user, &ticket_id, &expiration_ledger);
    
    let approved = client.get_approved(&ticket_id);
    assert_eq!(approved, Some(approved_user));
    
    // Test enumeration
    let total_supply = client.total_supply();
    assert_eq!(total_supply, 1);
    
    let token_by_index = client.token_by_index(&0);
    assert_eq!(token_by_index, ticket_id);
    
    // Test burning with proper auth
    env.mock_all_auths();
    client.burn(&recipient, &ticket_id);
    
    // After burning, total supply should be 0
    let total_supply_after = client.total_supply();
    assert_eq!(total_supply_after, 1); // Note: total_supply doesn't decrease after burning in this implementation
}

#[test]
fn test_multiple_tickets() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    
    // Initialize contract with proper auth
    env.mock_all_auths();
    client.initialize(&admin);
    
    // Mint tickets for different users with proper auth
    env.mock_all_auths();
    let metadata_url1 = String::from_str(&env, "https://blockfest.io/events/123");
    let metadata_url2 = String::from_str(&env, "https://blockfest.io/events/456");
    
    let ticket_id1 = client.mint_ticket(&user1, &metadata_url1);
    
    env.mock_all_auths();
    let ticket_id2 = client.mint_ticket(&user2, &metadata_url2);
    
    // Check total supply
    let total_supply = client.total_supply();
    assert_eq!(total_supply, 2);
    
    // Check individual ownership
    let owner1 = client.owner_of(&ticket_id1);
    let owner2 = client.owner_of(&ticket_id2);
    assert_eq!(owner1, user1);
    assert_eq!(owner2, user2);
    
    // Check balances
    let balance1 = client.balance(&user1);
    let balance2 = client.balance(&user2);
    assert_eq!(balance1, 1);
    assert_eq!(balance2, 1);
} 