---
name: earnbase-agent-tasks
description: >
  Comprehensive skill for AI agents to request human feedback via Earnbase
  on Celo. Covers the full "Open-Close" lifecycle: Quote (First Trigger),
  Payment (Wallet/Manual), Submission (Second Trigger), Result Retrieval,
  and Platform Rating. Use this skill whenever an agent needs to collect
  human labels, ratings, verifications, or text input from real humans,
  interact with the Earnbase protocol, or submit on-chain feedback via ERC-8004.
---

# Earnbase Agent Tasks: The "Open-Close" Lifecycle

This skill allows an AI agent to request human feedback on the Earnbase
platform on Celo. Humans complete the tasks and the agent retrieves results
on-chain.

---

## 📥 Installation

```bash
# Step 1: Install the skill
npx skills add jeffIshmael/earnbase-skills

# Step 2: Install dependencies (run once from the skill directory)
cd .agents/skills/earnbase-agent-tasks && npm install
```

---

## ⚡ Calling the Functions

After installation, import and use `EarnbaseSkill` directly in your agent:

```typescript
import { EarnbaseSkill } from './.agents/skills/earnbase-agent-tasks/scripts/index.ts';

const earnbase = new EarnbaseSkill();
```

Or run a function standalone using `tsx`:

```bash
npx tsx .agents/skills/earnbase-agent-tasks/scripts/index.ts
```

---

## 🔄 The Open-Close Lifecycle

All interactions follow a 6-step lifecycle split into two phases:

### OPEN PHASE (Steps 1–3) — Create and fund the task
1. **Quote** → `getTaskQuote(taskSpecs)` — get price and destination address
2. **Pay** → wallet signature (X402) OR manual tx hash from human admin
3. **Submit** → `requestHumanTask(signature | null, taskSpecs)` — opens task on Earnbase

### CLOSE PHASE (Steps 4–6) — Receive results and close the loop
4. **Wait** → `listenForCompletion(callback)` (preferred) or poll `queryTaskResults(agentRequestId)`
5. **Retrieve** → fetch results JSON from `resultsUrl` (IPFS via Pinata)
6. **Rate** → `submitPlatformRating(agentRequestId, rating)` — on-chain ERC-8004 rating

---

## 🛠 Available Methods

| Method | Description | Returns |
|---|---|---|
| `getTaskQuote(taskSpecs)` | Get price and payment destination | `{ destinationAddress, priceAmount, priceCurrency, status: 402 }` |
| `requestHumanTask(sig, taskSpecs)` | Submit and open the task | `{ taskId, agentRequestId, status }` |
| `queryTaskResults(agentRequestId)` | Poll for results | `{ status, resultsUrl, ipfsHash }` |
| `listenForCompletion(callback)` | Event-driven result listener | unwatch function |
| `submitPlatformRating(agentRequestId, rating)` | Rate platform 1–100 per category | `{ success }` |

---

## 🏷 ERC-8004 Feedback Tags

| Source | `tag1` | `tag2` |
|---|---|---|
| Human user (Earnbase UI) | `task-clarity`, `reward-fairness`, `platform-experience` | `"human-feedback"` |
| AI agent (after results) | `result-accuracy`, `response-time`, `overall-service` | `"agent-feedback"` |

---

## 📄 Full Reference

For complete code examples, error handling, and network details, see:
[references/EARNBASE_AGENT_GUIDE.md](./references/EARNBASE_AGENT_GUIDE.md)