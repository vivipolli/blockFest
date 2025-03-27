#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, token};

#[contracttype]
#[derive(Clone)]
pub struct Ticket {
    owner: Address,
    event_metadata_url: String,
    ticket_id: u64,
    is_used: bool,
}

#[contract]
pub struct TicketNFT;

#[contractimpl]
impl TicketNFT {
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&Symbol::new(&env, "admin"), &admin);
        env.storage().instance().set(&Symbol::new(&env, "next_ticket_id"), &0u64);
    }

    pub fn mint_ticket(
        env: Env,
        to: Address,
        event_metadata_url: String,
        organizer: Address,
        price: i128,
        token_id: Address,
    ) -> u64 {
        to.require_auth();
        
        // Transfer payment from buyer to organizer using the token interface
        if price > 0 {
            let token_client = token::Client::new(&env, &token_id);
            token_client.transfer(&to, &organizer, &price);
        }
        
        // Get next ticket ID
        let next_id: u64 = env.storage().instance().get(&Symbol::new(&env, "next_ticket_id")).unwrap_or(0);
        
        // Create ticket
        let ticket = Ticket {
            owner: to.clone(),
            event_metadata_url,
            ticket_id: next_id,
            is_used: false,
        };
        
        // Store ticket
        env.storage().persistent().set(&next_id, &ticket);
        
        // Update next ticket ID
        env.storage().instance().set(&Symbol::new(&env, "next_ticket_id"), &(next_id + 1));
        
        next_id
    }
    
    pub fn get_ticket(env: Env, ticket_id: u64) -> Ticket {
        env.storage().persistent().get(&ticket_id).unwrap()
    }
    
    pub fn transfer_ticket(env: Env, from: Address, to: Address, ticket_id: u64) {
        from.require_auth();
        
        let mut ticket: Ticket = env.storage().persistent().get(&ticket_id).unwrap();
        
        // Verify ownership
        if ticket.owner != from {
            panic!("not the ticket owner");
        }
        
        // Verify ticket is not used
        if ticket.is_used {
            panic!("ticket already used");
        }
        
        // Transfer ownership
        ticket.owner = to;
        
        // Update storage
        env.storage().persistent().set(&ticket_id, &ticket);
    }
    
    pub fn use_ticket(env: Env, ticket_id: u64, user: Address) {
        user.require_auth();
        
        let mut ticket: Ticket = env.storage().persistent().get(&ticket_id).unwrap();
        
        // Verify ownership
        if ticket.owner != user {
            panic!("not the ticket owner");
        }
        
        // Verify ticket is not used
        if ticket.is_used {
            panic!("ticket already used");
        }
        
        // Mark as used
        ticket.is_used = true;
        
        // Update storage
        env.storage().persistent().set(&ticket_id, &ticket);
    }
    
    pub fn is_ticket_used(env: Env, ticket_id: u64) -> bool {
        let ticket: Ticket = env.storage().persistent().get(&ticket_id).unwrap();
        ticket.is_used
    }
}

mod test; 