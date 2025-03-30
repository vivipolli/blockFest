#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Bytes, String, Env, Vec};

#[contract]
pub struct TicketNFT;

#[contracttype]
pub enum DataKey {
    Owner(i128),
    TokenCount,
    Approvals(i128),
    Metadata,
    Image,
}

#[contractimpl]
impl TicketNFT {
    const SUPPLY: i128 = 1000;
    const NAME: &'static str = "Ticket BlockFest";
    const SYMBOL: &'static str = "TBF";

    pub fn owner_of(env: Env, token_id: i128) -> Address {
        env.storage().persistent().get(&DataKey::Owner(token_id)).unwrap_or_else(|| {
            Address::from_string_bytes(&Bytes::from_slice(&env, &[0; 32]))
        })
    }

    pub fn name(env: Env) -> String {
        String::from_str(&env, Self::NAME)
    }

    pub fn symbol(env: Env) -> String {
        String::from_str(&env, Self::SYMBOL)
    }

    pub fn token_uri(env: Env) -> String {
        env.storage().persistent().get(&DataKey::Metadata).unwrap_or_else(|| String::from_str(&env, ""))
    }

    pub fn token_image(env: Env) -> String {
        env.storage().persistent().get(&DataKey::Image).unwrap_or_else(|| String::from_str(&env, ""))
    }

    pub fn is_approved(env: Env, operator: Address, token_id: i128) -> bool {
        let key = DataKey::Approvals(token_id);
        let approvals = env.storage().persistent().get::<DataKey, Vec<Address>>(&key).unwrap_or_else(|| Vec::new(&env));
        approvals.contains(&operator)
    }

    pub fn transfer(env: Env, owner: Address, to: Address, token_id: i128) {
        owner.require_auth();
        let actual_owner = Self::owner_of(env.clone(), token_id);
        if owner == actual_owner {
            env.storage().persistent().set(&DataKey::Owner(token_id), &to);
            env.storage().persistent().remove(&DataKey::Approvals(token_id));
            env.events().publish((symbol_short!("Transfer"),), (owner, to, token_id));
        } else {
            panic!("Not the token owner");
        }
    }

    pub fn mint(env: Env, to: Address, metadata: String, image: String) {
        let mut token_count: i128 = env.storage().persistent().get(&DataKey::TokenCount).unwrap_or(0);
        assert!(token_count < Self::SUPPLY, "Maximum token supply reached");
        token_count += 1;
        env.storage().persistent().set(&DataKey::TokenCount, &token_count);
        env.storage().persistent().set(&DataKey::Owner(token_count), &to);
        
        // Store metadata and image for this specific token
        env.storage().persistent().set(&DataKey::Metadata, &metadata);
        env.storage().persistent().set(&DataKey::Image, &image);
        
        env.events().publish((symbol_short!("Mint"),), (to, token_count));
    }

    pub fn approve(env: Env, owner: Address, to: Address, token_id: i128) {
        owner.require_auth();
        let actual_owner = Self::owner_of(env.clone(), token_id);
        if owner == actual_owner {
            let key = DataKey::Approvals(token_id);
            let mut approvals = env.storage().persistent().get::<DataKey, Vec<Address>>(&key).unwrap_or_else(|| Vec::new(&env));
            if !approvals.contains(&to) {
                approvals.push_back(to.clone());
                env.storage().persistent().set(&key, &approvals);
                env.events().publish((symbol_short!("Approval"),), (owner, to, token_id));
            }
        } else {
            panic!("Not the token owner");
        }
    }

    pub fn transfer_from(env: Env, spender: Address, from: Address, to: Address, token_id: i128) {
        spender.require_auth();
        let actual_owner = Self::owner_of(env.clone(), token_id);
        if from != actual_owner {
            panic!("From not owner");
        }
        let key = DataKey::Approvals(token_id);
        let approvals = env.storage().persistent().get::<DataKey, Vec<Address>>(&key).unwrap_or_else(|| Vec::new(&env));
        if !approvals.contains(&spender) {
            panic!("Spender is not approved for this token");
        }
        env.storage().persistent().set(&DataKey::Owner(token_id), &to);
        env.storage().persistent().remove(&DataKey::Approvals(token_id));
        env.events().publish((symbol_short!("Transfer"),), (from, to, token_id));
    }
}

//mod test;