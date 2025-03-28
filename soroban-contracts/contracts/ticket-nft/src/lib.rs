#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct Ticket {
    owner: Address,
    event_metadata_url: String,
    is_used: bool,
}

#[contract]
pub struct TicketNFT;

#[contractimpl]
impl TicketNFT {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&Symbol::new(&env, "ADMIN"), &admin);
        env.storage().instance().set(&Symbol::new(&env, "next_token_id"), &0u32);
    }

    // Função para criar um novo ticket
    pub fn mint_ticket(env: Env, to: Address, event_metadata_url: String) -> u32 {
        // Verifica se o chamador é o administrador
        let admin: Address = env.storage().instance().get(&Symbol::new(&env, "ADMIN")).unwrap();
        admin.require_auth();
        
        // Mint um novo token NFT
        let token_id = mint_token(&env);
        
        // Armazena os metadados do ticket
        let ticket = Ticket {
            owner: to,
            event_metadata_url,
            is_used: false,
        };
        
        env.storage().persistent().set(&token_id, &ticket);
        
        token_id
    }

    // Marca um ticket como usado
    pub fn use_ticket(env: Env, ticket_id: u32) {
        // Verifica se o chamador é o dono do ticket
        let ticket: Ticket = env.storage().persistent().get(&ticket_id).unwrap();
        ticket.owner.require_auth();
        
        // Verifica se o ticket já foi usado
        if ticket.is_used {
            panic!("Ticket already used");
        }
        
        // Marca o ticket como usado
        let updated_ticket = Ticket {
            owner: ticket.owner,
            event_metadata_url: ticket.event_metadata_url,
            is_used: true,
        };
        
        env.storage().persistent().set(&ticket_id, &updated_ticket);
    }

    // Verifica se um ticket foi usado
    pub fn is_ticket_used(env: Env, ticket_id: u32) -> bool {
        let ticket: Ticket = env.storage().persistent().get(&ticket_id).unwrap();
        ticket.is_used
    }
    
    // Implementação das funções básicas de NFT
    pub fn balance(env: Env, owner: Address) -> u32 {
        let mut count = 0;
        let total = TicketNFT::total_supply(env.clone());
        
        for i in 0..total {
            let token_id = i;
            if let Some(ticket) = env.storage().persistent().get::<u32, Ticket>(&token_id) {
                if ticket.owner == owner {
                    count += 1;
                }
            }
        }
        
        count
    }
    
    pub fn owner_of(env: Env, token_id: u32) -> Address {
        let ticket: Ticket = env.storage().persistent().get(&token_id).unwrap();
        ticket.owner
    }
    
    pub fn transfer(env: Env, from: Address, to: Address, token_id: u32) {
        from.require_auth();
        
        // Verifica se o remetente é o dono
        let ticket: Ticket = env.storage().persistent().get(&token_id).unwrap();
        if ticket.owner != from {
            panic!("Not the owner");
        }
        
        // Atualiza o proprietário nos metadados do ticket
        let updated_ticket = Ticket {
            owner: to,
            event_metadata_url: ticket.event_metadata_url,
            is_used: ticket.is_used,
        };
        
        env.storage().persistent().set(&token_id, &updated_ticket);
    }
    
    pub fn total_supply(env: Env) -> u32 {
        env.storage().instance().get(&Symbol::new(&env, "next_token_id")).unwrap_or(0)
    }
    
    pub fn token_by_index(env: Env, index: u32) -> u32 {
        // Verifica se o índice é válido
        let total = TicketNFT::total_supply(env.clone());
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
        let ticket: Ticket = env.storage().persistent().get(&token_id).unwrap();
        if ticket.owner != owner {
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
        
        // Verifica se o remetente é o dono
        let ticket: Ticket = env.storage().persistent().get(&token_id).unwrap();
        if ticket.owner != from {
            panic!("Not the owner");
        }
        
        // Remove o token
        env.storage().persistent().remove(&token_id);
    }
}

// Funções auxiliares internas
fn mint_token(env: &Env) -> u32 {
    // Obtém o próximo ID de token
    let next_token_id: u32 = env.storage().instance().get(&Symbol::new(env, "next_token_id")).unwrap_or(0);
    
    // Incrementa o contador
    env.storage().instance().set(&Symbol::new(env, "next_token_id"), &(next_token_id + 1));
    
    next_token_id
}

mod test; 