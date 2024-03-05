use anchor_lang::prelude::*;

declare_id!("4eoW5CFDVGzFGuCY3tLNCH1gkNEGMNSJ4koF74kgMZ4L");

#[program]
pub mod anchor_boilerplate {
    use super::*;

    pub fn create_user_counter(ctx: Context<CreateCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.bump = ctx.bumps.counter;
        Ok(())
    }
    pub fn initialize(ctx: Context<Initialize>, initial_value: u64) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter;
        counter_account.count = initial_value;
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter;
        counter_account.count += 1;
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter;
        counter_account.count -= 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCounter<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"user-stats", user.key().as_ref()], bump
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub bump: u8,
}
