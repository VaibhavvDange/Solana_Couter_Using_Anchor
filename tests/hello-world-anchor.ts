import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorBoilerplate } from "../target/types/anchor_boilerplate";
import { PublicKey } from '@solana/web3.js'
import { expect } from "chai";


describe("anchor-boilerplate", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorBoilerplate as Program<AnchorBoilerplate>;
  console.log("🚀 ~ describe ~ program:", program.account.counter)
  // const counter = anchor.web3.Keypair.generate();
  const [counter, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('user-stats'),
      provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
  )
  console.log("🚀 ~ describe ~ counter:", counter.toBase58())
  // const user = anchor.web3.Keypair.generate()


  it("Is initialized !", async () => {
    // const account = await program.account.counter.fetch(counter.publicKey)
    // const data = account.count; 
    // console.log("🚀 ~ it ~ data:", data)
    // Add your test here.
    const tx = await program.methods.createUserCounter()
    .accounts({
      counter: counter,
      user: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    // .signers([])
    .rpc();

    console.log("counter public key : ",counter);
    console.log("user public key : ",program.provider.publicKey);
    console.log("systemProgram id: ",anchor.web3.SystemProgram.programId);
    console.log("Your transaction signature", tx);
    console.log("🚀 ~ it ~ counter:", counter)
    
    // console.log("🚀 ~ it ~ data:", account.count);
  });

  it("Is incremented !", async () => {
    // Add your test here.
    const account = await program.account.counter.fetch(counter)

    const data = account.count;
    await console.log("🚀 ~ it ~ data:", data)
    const tx = await program.methods.increment()
      .accounts({
        counter: counter,
        user: program.provider.publicKey,
      })
      .rpc();

    const accountAfter = await program.account.counter.fetch(counter)

      await console.log(accountAfter.count);
    console.log("Your transaction signature", tx);
    expect(accountAfter.count.toNumber()).equals(1);
    
  });

  it("Is decremented !", async () => {
    // Add your test here.
    const account = await program.account.counter.fetch(counter)

    const data = account.count;
    await console.log("🚀 ~ it ~ data:", data)
    const tx = await program.methods.decrement()
      .accounts({
        counter: counter,
        user: program.provider.publicKey,
      })
      .rpc();

    const accountAfter = await program.account.counter.fetch(counter)

      await console.log(accountAfter.count);
    console.log("Your transaction signature", tx);
    expect(accountAfter.count.toNumber()).equals(0);
    
  });
});
