# Repository Instructions

## Project purpose

This project is a local-first AI orchestration layer for Home Assistant. A local LLM provides contextual reasoning and planning, while deterministic application code retains authority over which actions are permitted and executed.

The intended flow is:

```text
Home Assistant
  -> relevant state collection
  -> allow/deny filtering
  -> state normalization
  -> deterministic safety/rules
  -> local Ollama LLM
  -> structured proposed actions
  -> schema validation
  -> deterministic policy validation
  -> Home Assistant execution
```

The LLM is a planner and reasoning component. It is never an authority or execution engine.

## Deployment constraints

The project runs in a small Proxmox home lab:

- Dell OptiPlex 3060 SFF host with an Intel Core i5-8500 (6 cores/6 threads) and 16 GB RAM.
- Home Assistant OS runs in a separate VM.
- Ollama runs CPU-only in a separate Ubuntu LXC.
- The TypeScript orchestrator runs in another Ubuntu LXC.
- The currently preferred local model is Gemma 4 E2B.

Treat compute and memory as constrained. Prefer compact model context, relevant-state selection, event-driven processing, fewer LLM calls, reasonable timeouts, and simple infrastructure.

Keep model integration model-agnostic where practical.

Never put private IP addresses, private URLs, credentials, tokens, or installation-specific identifiers in source code or documentation.

## Safety invariants

Do not weaken these requirements without explicit approval:

- The LLM must never directly execute Home Assistant services.
- Treat all LLM output as untrusted input and validate it against a schema.
- Apply deterministic policy validation to proposed actions after model generation.
- Revalidate policy again at the final execution boundary.
- Only explicitly permitted entities may be controlled. Deny rules override allow rules.
- Never send the raw full Home Assistant state when normalized, relevant state is sufficient.
- Reject unknown entities and unsupported services.
- Reject duplicate and no-op actions when execution is implemented.
- Never claim success unless Home Assistant confirms the action.
- Never permit autonomous unlocking.
- Keep critical infrastructure entities denylisted.

## Repository and privacy rules

This repository is public. Never commit:

- `.env`
- Home Assistant tokens or other credentials/secrets
- Private Home Assistant URLs or private LAN addresses where a generic example is sufficient
- Installation-specific `allowed-entities.json` or `denied-entities.json`
- Private Home Assistant inventory or state dumps
- Real installation-specific entity IDs in public tests or examples

Use sanitized, generic values in public examples.

## Technology conventions

- TypeScript, Node.js 24+, and ESM
- Got for HTTP clients
- Zod for validation at runtime and external boundaries
- Vitest for tests
- XO for linting
- Prettier for formatting
- mise for development tool version management

Keep external API responses untrusted until validated. Prefer small modules with clear responsibilities. Keep HTTP transport, schemas, orchestration, policy validation, and execution separated. Avoid unnecessary dependencies.

## Development workflow

Before completing a change, run:

```sh
npm run format
npm run lint
npm run build
npm test
```

Do not make unrelated refactors during scoped work. Explain significant architectural changes before implementing them.

## Current development stage

Implemented:

- Home Assistant REST connectivity and state retrieval
- Zod validation of Home Assistant state
- JSON entity allow/deny policy
- Normalized AI-facing state
- Deny-overrides-allow behavior
- State normalization and policy tests

Current milestone: read-only Ollama planning. The model may generate validated proposed actions, but do not implement Home Assistant service execution as part of this milestone.
