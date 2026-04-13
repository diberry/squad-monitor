# TDD Implementation Plan: Team Activity Monitor

## Overview

A unified monitoring product built on Squad SDK that provides real-time visibility into team agent activity, work items, and resource consumption. Phase 1 starts with a single-team terminal monitor; Phase 2 scales to multi-repo orchestration with web dashboard.

---

## SDK Modules (Verified)

| Module | Provides | Gap | Status |
|--------|----------|-----|--------|
| `runtime.EventBus` (RuntimeEventBus) | In-process pub/sub for agent lifecycle events | Not cross-repo/org-wide | ✅ Available |
| `ralph.RalphMonitor` | Agent activity tracking, health state, work monitoring | N/A | ✅ Available |
| `runtime.cost-tracker` | Token/cost tracking per agent per session | N/A | ✅ Available |
| `runtime.streaming` | WebSocket/SSE event streaming | Single instance only | ✅ Available |
| `state.SquadState` | Read team state (agents, decisions, logs) | N/A | ✅ Available |
| `cross-squad` | Manifest discovery, issue delegation | Discovery only, no live aggregation | ⚠️ Limited |
| `platform.createPlatformAdapter()` | Read work items from GitHub/ADO | N/A | ✅ Available |

## Known Gaps to Build

- Cross-repo event aggregation (EventBus is in-process only)
- Web dashboard UI (Phase 2)
- Multi-user auth for shared dashboards (Phase 2)
- Historical replay/persistence
- Stuck detection logic
- Health indicators (circuit breaker, rate limits)

---

## Phase 1: Single-Team Terminal Monitor

### Feature Group: Agent Status Board

**Test: should initialize EventBus collector**
- Given: EventBus from SDK runtime
- When: MonitorCollector instantiated
- Then: collector is subscribed to agent lifecycle events

**Test: should track agent idle → working → completed transition**
- Given: EventBus with agent events
- When: agent moves through states
- Then: collector tracks state history for each agent

**Test: should expose current agent statuses**
- Given: collector with tracked agents
- When: getAgentStatuses() called
- Then: returns map of agentId → {state, duration, currentTask}

**Test: should format agents for terminal display**
- Given: agent statuses from collector
- When: TerminalRenderer.renderAgentBoard() called
- Then: outputs ANSI formatted table with agent ID, state, duration, task

**Implementation:**
- Create `MonitorCollector` class that subscribes to EventBus
- Track agent state machine: idle → working → completed|failed
- Store per-agent state snapshots with timestamps
- Create `TerminalRenderer` with renderAgentBoard() method using simple ANSI formatting

---

### Feature Group: Work Item Tracker

**Test: should read work items from platform adapter**
- Given: GitHub/ADO platform adapter initialized
- When: loadWorkItems() called
- Then: returns array of work items with id, title, assignee, status

**Test: should map work items to agents**
- Given: work items and agent assignments
- When: correlateWorkItems() called
- Then: builds bidirectional mapping of agent ↔ work items

**Test: should track work item state changes**
- Given: EventBus with work item update events
- When: state update emitted
- Then: collector updates work item status (open, in_progress, completed, blocked)

**Test: should render work item tracker to terminal**
- Given: work items with current status
- When: TerminalRenderer.renderWorkTracker() called
- Then: outputs ANSI table with work item ID, title, assignee agent, status, age

**Implementation:**
- Create `WorkItemAdapter` that wraps platform adapter (GitHub/ADO)
- Load and cache work items at startup
- Create `WorkItemCollector` that subscribes to EventBus for updates
- Implement status enum: OPEN, IN_PROGRESS, COMPLETED, BLOCKED
- Add terminal rendering with alignment on agent assignments

---

### Feature Group: Decision Feed

**Test: should collect decisions from SquadState**
- Given: SquadState with decisions array
- When: loadDecisions() called
- Then: returns array of {id, title, timestamp, author, status}

**Test: should subscribe to decision change events**
- Given: EventBus with decision events
- When: decision made/updated
- Then: DecisionCollector receives event and updates state

**Test: should maintain ordered decision feed**
- Given: multiple decision events
- When: getDecisionFeed() called
- Then: returns decisions ordered by timestamp (newest first)

**Test: should render decision feed with formatting**
- Given: decision feed
- When: TerminalRenderer.renderDecisionFeed() called
- Then: outputs ANSI formatted list with timestamp, title, author, status

**Implementation:**
- Create `DecisionCollector` that reads from SquadState.decisions
- Subscribe to decision lifecycle events via EventBus
- Store ordered list with timestamps
- Terminal renderer shows most recent 10 decisions in scrollable view

---

### Feature Group: Session Timeline

**Test: should create timeline entry for each significant event**
- Given: EventBus events (agent state change, decision, work item update, error)
- When: event emitted
- Then: TimelineCollector creates entry with {timestamp, type, agentId, message}

**Test: should filter events by type**
- Given: timeline with mixed event types
- When: getTimeline(filter={type:'agent_transition'}) called
- Then: returns only agent transition events

**Test: should format timeline for terminal display**
- Given: timeline entries
- When: TerminalRenderer.renderTimeline() called
- Then: outputs chronological list with HH:MM:SS, event type, agent, message

**Test: should maintain scrollable history**
- Given: timeline with 1000+ entries
- When: renderTimeline(limit=50) called
- Then: returns last 50 entries without loading all into memory

**Implementation:**
- Create `TimelineCollector` that subscribes to all EventBus event types
- Define event types: AGENT_IDLE, AGENT_WORKING, AGENT_COMPLETED, AGENT_FAILED, DECISION_MADE, WORK_ITEM_UPDATED, ERROR
- Store entries in circular buffer (fixed size, oldest entries dropped)
- Terminal renderer shows filtered view with timestamps

---

### Feature Group: Terminal UI Integration

**Test: should initialize monitor with all collectors**
- Given: SDK runtime, platform adapter, SquadState
- When: TeamActivityMonitor.start() called
- Then: EventBus, RalphMonitor, CostTracker, WorkItemAdapter initialized

**Test: should render complete dashboard**
- Given: all collectors with data
- When: render() called
- Then: outputs agent board, work tracker, decision feed, timeline to terminal

**Test: should handle refresh cycle (every 1s)**
- Given: running monitor
- When: 1 second elapses
- Then: collectors polled, terminal redrawn with fresh data

**Test: should exit gracefully on interrupt**
- Given: monitor running with subscriptions
- When: SIGINT received (Ctrl+C)
- Then: all subscriptions cleared, process exits cleanly

**Implementation:**
- Create `TeamActivityMonitor` main class
- Orchestrate MonitorCollector, WorkItemCollector, DecisionCollector, TimelineCollector
- Implement render loop with 1s refresh interval
- Set up signal handlers for graceful shutdown
- Terminal output: 4-section layout (agents | work items | decisions | timeline)

---

## Phase 1 Extension: Cost & Health

### Feature Group: Cost Ticker

**Test: should track cost per agent**
- Given: CostTracker from SDK
- When: getAgentCosts(agentId) called
- Then: returns {tokens: N, estimatedCost: $X, startTime, duration}

**Test: should aggregate total session cost**
- Given: costs from all agents
- When: getTotalCost() called
- Then: returns sum of all agent costs

**Test: should calculate cost per minute**
- Given: total cost and elapsed time
- When: getCostRate() called
- Then: returns tokens/min and $/min

**Test: should render cost ticker**
- Given: cost data
- When: TerminalRenderer.renderCostTicker() called
- Then: outputs formatted line with total cost, rate, remaining budget (if set)

**Implementation:**
- Create `CostCollector` that wraps SDK CostTracker
- Poll CostTracker every 5 seconds for updates
- Calculate running rates (tokens/min, $/min)
- Terminal shows: Total: $X | Rate: Y tokens/min | Budget: Z remaining

---

### Feature Group: Health Indicators

**Test: should read health from RalphMonitor**
- Given: RalphMonitor with agent health state
- When: getAgentHealth(agentId) called
- Then: returns {circuit_breaker_open: bool, rate_limited: bool, error_count: N, last_error: timestamp}

**Test: should detect rate limit conditions**
- Given: EventBus with rate limit events
- When: rate limit event emitted
- Then: HealthCollector marks agent as rate_limited, shows ETA to recovery

**Test: should track circuit breaker state**
- Given: agent with repeated errors
- When: error threshold exceeded
- Then: marks agent as circuit_breaker_open, prevents new work

**Test: should render health indicators**
- Given: health data for all agents
- When: TerminalRenderer.renderHealthIndicators() called
- Then: outputs colored indicators (🟢 healthy, 🟡 rate-limited, 🔴 circuit-open)

**Implementation:**
- Create `HealthCollector` that reads RalphMonitor state
- Define health states: HEALTHY, RATE_LIMITED, CIRCUIT_OPEN, ERROR
- Poll every 2 seconds
- Terminal indicators next to agent names in board

---

### Feature Group: File Change Tracker

**Test: should collect file modifications from EventBus**
- Given: EventBus with file change events
- When: event emitted (agent modified file)
- Then: FileChangeCollector records {filepath, agent, timestamp, changeType}

**Test: should group changes by file**
- Given: file change events
- When: getChangesByFile() called
- Then: returns map of filepath → [{agent, timestamp, changeType}]

**Test: should identify frequently modified files**
- Given: file change history
- When: getHotFiles(limit=10) called
- Then: returns top 10 files by modification count in session

**Test: should render file change summary**
- Given: file changes
- When: TerminalRenderer.renderFileChanges() called
- Then: outputs list with filepath, count, most recent agent, timestamp

**Implementation:**
- Create `FileChangeCollector` subscribed to EventBus
- Track: filepath, agent id, timestamp, change type (create, modify, delete)
- Calculate hot files (modification count)
- Terminal view: top 10 modified files with agent attribution

---

### Feature Group: Stuck Detection

**Test: should detect agent inactivity > N minutes**
- Given: agent working with no output for 5 minutes
- When: checkStuckAgents() called
- Then: returns list of stuck agent IDs

**Test: should emit alert on stuck detection**
- Given: agent becomes stuck
- When: 5 minute threshold exceeded
- Then: emits alert event to EventBus

**Test: should distinguish stuck from slow**
- Given: agent working but producing output
- When: checkStuckAgents() called
- Then: does NOT mark as stuck (last activity timestamp recent)

**Test: should render stuck alerts prominently**
- Given: stuck agents detected
- When: TerminalRenderer.renderAlerts() called
- Then: outputs prominent ⚠️ STUCK alerts with agent ID, duration

**Implementation:**
- Create `StuckDetector` that tracks last activity per agent
- Define stuck threshold: 5 minutes without EventBus update
- Poll every 30 seconds
- Emit AGENT_STUCK event on detection
- Terminal: alerts section with stuck agents sorted by duration

---

## Dependency Graph

```
Phase 1 Core:
├── EventBus Collector (foundation)
├── MonitorCollector (depends on EventBus Collector)
├── WorkItemAdapter (independent, platform adapter)
├── WorkItemCollector (depends on EventBus Collector + WorkItemAdapter)
├── DecisionCollector (depends on SquadState + EventBus Collector)
├── TimelineCollector (depends on EventBus Collector)
├── TerminalRenderer (depends on all collectors)
└── TeamActivityMonitor (orchestrates all)

Phase 1 Extension (depends on Phase 1 Core):
├── CostCollector (depends on CostTracker)
├── HealthCollector (depends on RalphMonitor)
├── FileChangeCollector (depends on EventBus Collector)
└── StuckDetector (depends on EventBus Collector)
```

---

## File Structure

```
src/
├── index.ts                      # Main entry point
├── core/
│   ├── eventbus-collector.ts    # Subscribes to EventBus, tracks lifecycle
│   ├── monitor-collector.ts      # Agent status tracking
│   ├── timeline-collector.ts     # Event timeline
│   └── types.ts                  # Shared types (AgentState, EventType, etc)
├── collectors/
│   ├── work-item-collector.ts   # Work item tracking
│   ├── decision-collector.ts     # Decision feed
│   ├── cost-collector.ts         # Cost tracking
│   ├── health-collector.ts       # Health indicators
│   ├── file-change-collector.ts # File modification tracking
│   └── stuck-detector.ts         # Stuck agent detection
├── adapters/
│   ├── work-item-adapter.ts      # Platform adapter wrapper (GitHub/ADO)
│   └── platform-adapter-factory.ts
├── renderers/
│   ├── terminal-renderer.ts      # Main ANSI rendering
│   ├── formatters/
│   │   ├── agent-board.ts       # Agent table formatting
│   │   ├── work-tracker.ts      # Work item formatting
│   │   ├── decision-feed.ts     # Decision list formatting
│   │   ├── timeline.ts          # Timeline formatting
│   │   ├── cost-ticker.ts       # Cost display
│   │   ├── health-indicator.ts  # Health status
│   │   ├── file-changes.ts      # File change summary
│   │   └── alerts.ts            # Alert display
│   └── ansi-utils.ts            # ANSI color/formatting utilities
└── monitor.ts                    # Main TeamActivityMonitor orchestrator

test/
├── core/
│   ├── eventbus-collector.test.ts
│   ├── monitor-collector.test.ts
│   ├── timeline-collector.test.ts
│   └── types.test.ts
├── collectors/
│   ├── work-item-collector.test.ts
│   ├── decision-collector.test.ts
│   ├── cost-collector.test.ts
│   ├── health-collector.test.ts
│   ├── file-change-collector.test.ts
│   └── stuck-detector.test.ts
├── adapters/
│   ├── work-item-adapter.test.ts
│   └── platform-adapter-factory.test.ts
├── renderers/
│   ├── terminal-renderer.test.ts
│   ├── formatters/
│   │   ├── agent-board.test.ts
│   │   ├── work-tracker.test.ts
│   │   ├── decision-feed.test.ts
│   │   ├── timeline.test.ts
│   │   ├── cost-ticker.test.ts
│   │   ├── health-indicator.test.ts
│   │   ├── file-changes.test.ts
│   │   └── alerts.test.ts
│   └── ansi-utils.test.ts
└── monitor.test.ts
```

---

## Testing Strategy

**Unit Tests (per-module):**
- Each collector/adapter/formatter tested independently
- Mock EventBus, SquadState, CostTracker, RalphMonitor
- Assert data structures, filtering, state transitions

**Integration Tests:**
- TeamActivityMonitor with all collectors
- Full render cycle from EventBus to terminal output
- Signal handling and graceful shutdown

**Test Utilities:**
- Mock EventBus event generator
- Fixture: sample agent states, work items, decisions
- Helper: assert ANSI output contains expected strings

---

## Build Order

1. **Week 1: Core Infrastructure**
   - EventBus Collector
   - MonitorCollector
   - TimelineCollector
   - Basic TerminalRenderer

2. **Week 2: Work Items & Decisions**
   - WorkItemAdapter
   - WorkItemCollector
   - DecisionCollector
   - Work item & decision formatters

3. **Week 3: Integration & Polish**
   - TeamActivityMonitor orchestrator
   - Render loop & signal handling
   - End-to-end integration tests
   - Terminal UI refinement

4. **Week 4+: Phase 1 Extension (P1)**
   - CostCollector
   - HealthCollector
   - FileChangeCollector
   - StuckDetector

---

## Acceptance Criteria

- ✅ Agent status board updates in real-time
- ✅ Work items tracked and attributed to agents
- ✅ Decision feed displays with timestamps
- ✅ Timeline shows all significant events
- ✅ Terminal output clear and scannable
- ✅ Ctrl+C exits gracefully
- ✅ All unit tests pass (>80% coverage)
- ✅ No performance degradation to agent execution

---

## Known Limitations (Phase 1)

- **Single instance only:** EventBus in-process; no cross-repo visibility
- **Terminal only:** No web UI (deferred to Phase 2)
- **No persistence:** History lost on process exit
- **No auth:** No multi-user access control
- **Manual refresh:** Dashboard updates every 1s; not real-time push

---

## Future (Phase 2)

- Cross-repo event aggregation
- Web dashboard UI
- Multi-user auth
- Historical replay
- Org-wide squad discovery integration
