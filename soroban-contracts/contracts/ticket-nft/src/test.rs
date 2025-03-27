#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_ticket_nft_basic() {
    let env = Env::default();
    let contract_id = env.register(TicketNFT, ());
    let client = TicketNFTClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let organizer = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);
    
    // Mock all authorizations for testing
    env.mock_all_auths();
    
    // Mint a ticket without payment
    let metadata_url = String::from_str(&env, "https://blockfest.io/events/123");
    let price = 0; // No payment required
    let token_id = Address::generate(&env); // Dummy token address
    
    let ticket_id = client.mint_ticket(&user, &metadata_url, &organizer, &price, &token_id);
    
    // Get ticket
    let ticket = client.get_ticket(&ticket_id);
    assert_eq!(ticket.owner, user);
    assert_eq!(ticket.event_metadata_url, metadata_url);
    assert_eq!(ticket.ticket_id, ticket_id);
    assert_eq!(ticket.is_used, false);
    
    // Use ticket
    client.use_ticket(&ticket_id, &user);
    
    // Check if ticket is used
    let is_used = client.is_ticket_used(&ticket_id);
    assert_eq!(is_used, true);
} 