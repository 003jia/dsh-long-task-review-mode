# Workflow reference

[中文](workflow.md) · [English](workflow.en.md) · [Quick start](../README.en.md)

## Routing and task lifetime

Select Long Task Mode in a new empty conversation. The primary model classifies the first request as coding or non-code; coding includes implementation, debugging, reading, and review. Complexity is not the criterion.

- Non-code: answer normally with tools as needed, without a mandatory `plan.md` or independent evaluation.
- Coding with independent review enabled: structured `plan.md`, evidence for each item, independent item review, then overall review.
- Coding with independent review disabled: an ordinary task plan, execution, item self-review, and overall self-review by the primary model. Results identify this as self-review.

The independent-review switch defaults to enabled. The Host records the route, reviewer, thresholds, and policy for each new job. Later global changes do not reclassify an active job or rewrite approvals. A job that requires independent review cannot bypass it by submitting `selfReview` or changing its classification. Only that branch checks independent-review availability; an unavailable reviewer blocks it without fallback.

The native preset becomes fixed once the conversation starts. Task actions provide pause, continue, end, and new-task operations. Reloading the application/plugin waits for user continuation. Unfinished work retains its job ID, route, and accepted records across compaction and later turns. A fresh request after completion is classified again.

## Plan and item submission

The independently reviewed branch uses the `claude-loop-plan/v1` template returned by `loop_tasks`. After Host validation of `plan.md`, submit only the current item's update:

```json
{
  "taskUpdate": {
    "id": "T01",
    "status": "completed",
    "result": "What was delivered and checked",
    "evidenceIds": ["receipt-id-returned-by-the-tool"]
  }
}
```

This illustrates the update shape; actual evidence IDs must come from real execution. Accepted results, evidence, and scores cannot be rewritten from a summary. `laya_tasks` is a compatibility alias for the same implementation. Older sessions and plan formats remain readable; installation does not create missing historical scores.

Declare the actual deliverable paths in `affectedPaths` and supply real execution receipts. Content-only analysis can explicitly use `taskType: "opinion"` without inventing execution receipts. The task filesystem records SHA-256 fingerprints for files, binary content, directory members, additions/deletions, and in-directory symlinks. Out-of-workspace links, special files, and incomplete checks are rejected. Default limits: 512 entries, depth 32, 16 MiB per file, 64 MiB total.

When an earlier deliverable changes, the plugin identifies the task and path and blocks a new approval. After examining the gap, submit `revalidateTaskIds` and `repairAnalysis` separately. Only affected items are revalidated. Earlier accepted facts remain, with new records appended. This detects acceptance-boundary changes; it does not prevent arbitrary shell writes through an operating-system sandbox.

## Progress, budgets, and persistence

Three consecutive no-progress or unsuccessful attempts pause by default. Rewording a result does not renew execution-evidence progress or justify duplicate scoring. User continuation allows another limited repair round while cumulative tool, evaluation, token, and elapsed-time budgets remain intact. Per-job thresholds stay fixed.

Settings expose tool-call, evaluation, duration, primary-model token, and optional estimated-cost limits. Cost estimates use user-supplied input/output prices per million tokens in the same currency as the budget, without cache discounts. Missing usage blocks when cost budgeting is enabled. Limits are checked at turn/tool boundaries and cannot undo an in-flight request. Jev service billing is not included.

Durable state is stored in the plugin's `plugin:long-task/state` side log, separate from model context and chat summaries. Accepted records and user mode operations flush before returning. Record migrations must preserve history. The plugin does not alter DSH's published session format.

## Settings and reviewer backends

Settings retain four Claude Loop presets: the default balanced preset, fewer interruptions for long tasks, lower cost, and cautious review. Presets fill a draft; saving applies it. Advanced loop controls, tool discovery, per-turn tool-step limits, and call statistics remain available.

Local Laya settings include launcher, device, checkpoint, preload, offline cache, timeout, connection status, discovered tools/arguments, and a fixed-sample check. The Laya environment and model weights must be installed separately.

Jev uses the [TypeSafe System One HTTP protocol](https://docs.typesafe.ai/api/system-one), with default endpoint `https://api.typesafe.ai/v1/systemone` and model `jev-latest`. A compatible proxy can be configured. Do not supply a Chat Completions endpoint. The Host sends `model/state/questions`, normalizes the five-level 0–4 Score, and requires mandatory Choice conditions separately; confidence is not a substitute for a score.

Jev endpoints must use HTTPS; loopback proxies may use HTTP. Usernames/passwords in URLs, query strings, fragments, and redirects are rejected. Keys are stored through DSH's credential service. Settings/jobs retain references. Saving a key means configured, not validated: the explicit sample check validates real HTTP and response structure without changing task progress. Cloud-reviewed tasks send requirements, results, and referenced evidence to the configured endpoint. Local review remains the default.

New jobs snapshot their backend. Older jobs without the newer fields retain local review. After the first Jev score, the actual model version is saved and requested directly; a changed returned version stops evaluation without erasing approvals. Key rotation at the same endpoint can serve existing tasks. Changing endpoints requires a new key; the original job keeps its endpoint and credential reference. Connection-validation status must be rechecked after application restart; settings and accepted facts persist.

Missing fields, invalid numbers/probabilities, HTTP errors, timeout, or cancellation cannot produce an approval. There is no automatic retry or fallback reviewer. Repair configuration, then explicitly continue.

## DSH alpha.2 compatibility in 0.2.3

DSH `0.2.2-alpha.2` passes `PromptPresentation` through `system-prompt/assemble`; that object has no tool array. The plugin does not read `.some()`/`.filter()` from an absent array. Its owned task tools use per-step activation conditions, preventing ordinary mode from exposing long-task tools.

On alpha.2, MCP schemas follow the runtime's official tool-provider visibility and permissions. The older prompt-filtering optimization for deferred tools is inactive, with a one-time compatibility notice. `tool_catalog` discovery remains available. The previous array-based API path remains for rc.3. Existing routes, review policy, and accepted records are preserved.

## Build and validation boundaries

Set `DSH_SOURCE` to a compatible DSH source workspace with dependencies installed and packages built, then run `node scripts/build.mjs`. Run `node --test tests/*.test.mjs` against an installed supported DSH runtime. `DSH_NODE` and `DSH_RUNTIME` override the macOS defaults.

The Loader/Agent/Gateway, filesystem, compaction, and JSONL regressions use actual runtime services; external inference and reviewer responses are scripted. Formal alpha.2 real-model conversation checks passed for the previously failing conversation, a new ordinary conversation, and a new long-task conversation. These checks do not establish a full real coding-task outcome or live Jev scoring quality. CI checks artifact syntax, packaging, and documentation assets only.

Before migration, back up the profile and avoid running both legacy bundles and this package as task coordinators. Preserve a rollback copy. A build or visible settings page alone is insufficient to claim real workflow acceptance.
