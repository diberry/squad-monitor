# Executive Summary: Team Activity Monitor

## One-Liner
A real-time terminal dashboard built on Squad SDK that surfaces visibility into multi-agent workflows—showing what's running, what's stuck, and what it costs.

---

## The Problem
When autonomous agents run multi-step workflows, visibility disappears into logs. Team leads can't see which agents are active, whether work is blocked, or how much budget is burning until it's too late. The result: delayed incident detection, budget surprises, and blocked handoffs between teams. This happens **now** as Squad workflows scale across organizations.

---

## The Opportunity
Squad SDK already has the raw signals—EventBus for lifecycle events, CostTracker for spend, RalphMonitor for health, and SquadState for decisions. What's missing is a consumer-facing lens. Building the reference monitor **in** the SDK ecosystem (not as an external tool) means:
- Future Squad users get observability out-of-the-box
- The sample teaches real SDK patterns in context (event handling, state management, streaming)
- Enterprise adoption unlocks Phase 2: cross-repo orchestration with web dashboards

---

## Who Benefits

| Persona | Benefit |
|---------|---------|
| **Team Lead** | Real-time view of which agents are idle/working/stuck; catch cost overruns before they happen |
| **SDK Developer** | Reference implementation teaching EventBus pub/sub, state collectors, and terminal rendering patterns |
| **Platform Engineer** | Foundation for Phase 2 org-wide multi-repo monitoring and delegation tracking |
| **DevOps/SRE** | Stuck detection alerts + cost-per-minute rates for capacity planning and budget governance |

---

## What You'll Learn
- How to subscribe to SDK lifecycle events (EventBus) and build stateful collectors
- Pattern for correlated data (work items ↔ agent assignments)
- Real-time terminal rendering with ANSI formatting
- Integration with platform adapters (GitHub/ADO) for context
- Graceful signal handling and resource cleanup
- Testing strategies for event-driven systems

---

## Key Differentiator
Unlike generic observability tools (Datadog, Grafana), this **understands Squad semantics**—agents, work item correlation, team decisions, and cross-squad delegation. It speaks the language of autonomous workflows, not just CPU/memory. It's built **for** the problem, not retrofitted.

---

## Build vs. Buy

| Aspect | Squad Monitor | Grafana/Datadog |
|--------|---|---|
| **Agent semantics** | Native (agents, tasks, decisions) | Generic metrics only |
| **Onboarding** | Comes with SDK | Setup and instrumentation cost |
| **Cost model** | Included in sample | Per-user or per-metric fees |
| **Extensibility** | Hackable reference code | Vendor integrations |
| **Local-first** | Terminal-based, zero infrastructure | Cloud/SaaS required |

---

## ROI Signal

1. **Cost Avoidance**: Detect runaway agent sessions within 30 seconds; prevent 1-2 accidental $10K+ overruns per quarter per organization
2. **Time-to-Resolution**: Stuck agent alerts reduce MTTR from "discovery lag" to < 30 seconds; team can recover or kill the run immediately
3. **Adoption Velocity**: Developers seeing live agent activity in real-time increase confidence in Squad SDK; enables self-serve workflow debugging

---

## Phase 1 Scope (MVP)

- Terminal-based dashboard with 4-section layout (agent status, work items, decisions, timeline)
- Real-time cost ticker and health indicators
- Stuck detection (> 5 min inactivity) with alerts
- Single instance, in-process (no cross-repo yet)
- **Timeline:** 4-5 weeks

## Phase 2 (Future)
- Multi-repo discovery and aggregation
- Web UI for org-wide visibility
- Multi-user authentication and access control
- Historical replay and persistence

---

**Recommendation**: Ship Phase 1 as a reference sample in the Squad SDK ecosystem. It unlocks self-serve agent debugging, demonstrates best practices, and builds foundation for enterprise multi-team observability in Phase 2.
