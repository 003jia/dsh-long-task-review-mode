# dsh-cc-loop-alignment

English | [中文](README.zh.md)

Aligns the dsh agent loop with Claude Code's agent loop on existing extension points (no dsh source changes). Ported from the dynamic `claude-loop-alignment` plugin.

## Mechanisms

- **maxToolTurns** — per-user-turn tool-use budget (Claude Code `max_turns`). When the cap is reached, one grace step runs with an injected stop instruction; if the model still calls tools, the following step is rejected and the turn closes.
- **Snip pass** — prunes tool-result surface nodes once measured context pressure reaches `snipAtRatio` (requires `toolResultPruner`).
- **Pressure compaction** — optional `ctx.compaction.compactIfNeeded` at `compactAtRatio`; keep 0 when `dsh-compaction-basic` runs with `auto: true`.
- **Token budget** — per-user-turn output-token budget with nudge continuation (`Stopped at N% of token target... Keep working`) and a diminishing-returns stop (Claude Code `query/tokenBudget.ts`).
- **Max-output-tokens recovery** — steers the CC "Resume directly" message after a step hit the output cap.
- **`snip` tool** — model-driven history removal: deletes the oldest surface messages before the kept tail and replaces them with one placeholder (shadow-price protocol, no LLM call).
- **`plan_agent` tool** — read-only software-architect subagent (Claude Code PLAN_AGENT): read-only tool allowlist, `maxDepth: 1`, CC-style architect prompt with a Critical Files section.

## Install

```sh
# GitHub source install; pin a commit for repeatable deployments.
dsh plugin --profile web add github:003jia/dsh-cc-loop-alignment
```

For local development, use `dsh plugin --profile web add link:<absolute-path-to-this-repo>`.
If the older linked package is already installed, remove `@linxin666/dsh-cc-loop-alignment`
before adding this package so both bundle rows are not composed together.

GitHub installs run `prepare` to build the host and browser artifacts. pnpm 10+ may require an
explicit profile allowlist before running that build:

```yaml
allowBuilds:
  '@003jia/dsh-cc-loop-alignment': true
```

Restart the dsh host process. The settings card appears under Settings > Plugins; `snip` and `plan_agent` become available to every agent.

## Configuration

| Field | Default | Meaning |
| --- | --- | --- |
| `enabled` | true | Master switch |
| `announceToAgent` | true | System-prompt announcement section |
| `maxToolTurns` | 20 | Tool-use steps per user turn (0 = off) |
| `snipAtRatio` | 0.6 | Prune trigger pressure ratio (0 = off) |
| `compactAtRatio` | 0 | Summary-compaction pressure ratio (0 = off) |
| `turnTokenBudget` | 0 | Output-token budget (0 = off) |
| `budgetCompletionRatio` | 0.9 | Stop nudging at this budget share |
| `budgetDiminishingDelta` | 500 | Diminishing-returns delta |
| `maxTokensRecoveryLimit` | 3 | Output-cap resume attempts (0 = off) |

The host half applies to every agent in the deployment (global scope); the browser half renders the settings card. When the optional DSH settings service is present, the host registers `dsh-cc-loop` when that service becomes available and keeps committed settings synchronized with the loop mechanisms.
