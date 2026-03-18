/**
 * Earnbase Skill — Quick Example
 * Run with: npx tsx .claude/skills/agent-tasks/scripts/example.ts
 */

import { EarnbaseSkill } from './index.ts';

const earnbase = new EarnbaseSkill({
  apiUrl: "https://earnbase.vercel.app",  // default, can omit
  rpcUrl: "https://forno.celo.org",       // default Celo RPC
  // contractAddress: "0x..."             // add your deployed contract address
});

const taskSpecs = {
  title: "Sentiment Rating",
  prompt: "Rate the sentiment of this review from 1 (very negative) to 5 (very positive): 'This product exceeded my expectations!'",
  feedbackType: "rating" as const,
  constraints: {
    participants: 5,
    rewardPerParticipant: 0.5, // USDC
  }
};

async function run() {
  console.log("🔍 Step 1: Getting quote...");
  const quote = await earnbase.getTaskQuote(taskSpecs);
  console.log(`💰 Cost: ${quote.priceAmount} ${quote.priceCurrency}`);
  console.log(`📬 Pay to: ${quote.destinationAddress}`);

  // ─── PATH A: Autonomous wallet ─────────────────────────────────────────────
  // const paymentSignature = await signX402Payment(quote); // your signing logic
  // const task = await earnbase.requestHumanTask(paymentSignature, taskSpecs);

  // ─── PATH B: Manual payment (human admin pays) ─────────────────────────────
  // const txHash = "0x..."; // provided by human admin after sending USDC
  // const task = await earnbase.requestHumanTask(null, { ...taskSpecs, paymentTxHash: txHash });

  // ── For demo purposes — comment out above and use this with a real tx hash:
  // console.log("\n📋 Step 2: Task submitted. Waiting for results...");
  // console.log(`🆔 agentRequestId: ${task.agentRequestId}`);

  // ─── OPTION A: Event listener (preferred) ──────────────────────────────────
  // const unwatch = earnbase.listenForCompletion(async (log) => {
  //   unwatch();
  //   console.log("✅ Task completed on-chain:", log.args.resultsCID);
  //   const results = await earnbase.queryTaskResults(task.agentRequestId);
  //   const data = await fetch(results.resultsUrl!).then(r => r.json());
  //   console.log("📊 Human responses:", data);
  //   await earnbase.submitPlatformRating(task.agentRequestId, {
  //     "result-accuracy": 90,
  //     "response-time": 85,
  //     "human-quality": 92,
  //     "task-completion-rate": 100,
  //     "overall-service": 90
  //   });
  //   console.log("🎉 Loop closed. Rating submitted on-chain.");
  // });

  // ─── OPTION B: Polling ──────────────────────────────────────────────────────
  // let completed = false;
  // while (!completed) {
  //   const result = await earnbase.queryTaskResults(task.agentRequestId);
  //   if (result.status === 'completed') {
  //     completed = true;
  //     console.log("✅ Results ready:", result.resultsUrl);
  //   } else {
  //     console.log("⏳ Still processing... retrying in 30s");
  //     await new Promise(r => setTimeout(r, 30_000));
  //   }
  // }

  console.log("\n✅ Quote retrieved successfully. Uncomment payment steps to run the full flow.");
}

run().catch(console.error);