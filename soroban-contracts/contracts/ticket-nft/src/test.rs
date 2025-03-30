use crate::{TicketNFT, TicketNFTClient};
use soroban_sdk::{Env, String, Address};
use soroban_sdk::testutils::{Address as _};

#[test]
fn test_name() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    assert_eq!(client.name(), String::from_str(&env, "TicketNFT"));
}

#[test]
fn test_symbol() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    assert_eq!(client.symbol(), String::from_str(&env, "SBN"));
}

#[test]
fn test_token_uri() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    assert_eq!(
        client.token_uri(),
        String::from_str(
            &env,
            "https://ipfs.io/ipfs/QmegWR31kiQcD9S2katTXKxracbAgLs2QLBRGruFW3NhXC"
        )
    );
}

#[test]
fn test_token_image() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    assert_eq!(
        client.token_image(),
        String::from_str(
            &env,
            "https://ipfs.io/ipfs/QmeRHSYkR4aGRLQXaLmZiccwHw7cvctrB211DzxzuRiqW6"
        )
    );
}

#[test]
fn test_mint() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let to = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    client.mint(&to, &metadata, &image);
    let token_id: i128 = 1; // Since it's the first token minted
    assert_eq!(client.owner_of(&token_id), to);
    assert_eq!(client.token_uri(), metadata);
    assert_eq!(client.token_image(), image);
}

#[test]
fn test_owner_of() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    assert_eq!(client.owner_of(&token_id), owner);
}

#[test]
fn test_transfer() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let to = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    env.mock_all_auths();
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    client.transfer(&owner, &to, &token_id);
    assert_eq!(client.owner_of(&token_id), to);
}

#[test]
fn test_approve_and_is_approved() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let operator = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    env.mock_all_auths();
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    client.approve(&owner, &operator, &token_id);
    assert!(client.is_approved(&operator, &token_id));
}

#[test]
fn test_is_approved_false() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let operator = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    assert!(!client.is_approved(&operator, &token_id));
}

#[test]
fn test_transfer_from() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let operator = Address::generate(&env);
    let to = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    env.mock_all_auths();
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    client.approve(&owner, &operator, &token_id);
    client.transfer_from(&operator, &owner, &to, &token_id);
    assert_eq!(client.owner_of(&token_id), to);
}

#[test]
#[should_panic(expected = "Not the token owner")]
fn test_transfer_not_owner() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let not_owner = Address::generate(&env);
    let to = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    env.mock_all_auths();
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    client.transfer(&not_owner, &to, &token_id);
}

#[test]
#[should_panic(expected = "Spender is not approved for this token")]
fn test_transfer_from_not_approved() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let operator = Address::generate(&env);
    let to = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    env.mock_all_auths();
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    client.transfer_from(&operator, &owner, &to, &token_id);
}

#[test]
#[should_panic(expected = "From not owner")]
fn test_transfer_from_wrong_owner() {
    let env = Env::default();
    let contract_id = env.register_contract(None, TicketNFT);
    let client = TicketNFTClient::new(&env, &contract_id);
    let owner = Address::generate(&env);
    let wrong_owner = Address::generate(&env);
    let operator = Address::generate(&env);
    let to = Address::generate(&env);
    let metadata = String::from_str(&env, "https://example.com/ticket/metadata/1");
    let image = String::from_str(&env, "https://example.com/ticket/image/1");
    env.mock_all_auths();
    client.mint(&owner, &metadata, &image);
    let token_id: i128 = 1;
    client.approve(&owner, &operator, &token_id);
    client.transfer_from(&operator, &wrong_owner, &to, &token_id);
}