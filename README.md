# Team Activity Monitor

A terminal UI monitoring prototype that provides real-time visibility into team agent activity, work items, and resource consumption. This is Phase 1: a single-team terminal dashboard with support for agent status tracking, work item correlation, decision feeds, cost tracking, and health indicators.

> **Note:** This project does not currently integrate with Squad SDK. Platform adapters return simulated data. See [Future: SDK Integration](#future-sdk-integration) below for the planned integration path.

## Features

- **Agent Status Board** — Track real-time agent state transitions (idle → working → completed/failed) with duration and current tasks
- **Work Item Tracker** — Monitor work items from GitHub/Azure DevOps, correlate with agent assignments, and track status changes
- **Decision Feed** — View squad decisions in chronological order with timestamps and authorship
- **Session Timeline** — Stream all significant events (agent transitions, decisions, work updates, errors) in a scrollable history
- **Cost Tracking** — Track token consumption and estimated cost per agent, with aggregated session totals and per-minute rates
- **Health Indicators** — Monitor agent health state (circuit breaker, rate limits, error counts) with prominent alerts
- **File Change Tracking** — Track file modifications attributed to agents; identify "hot files" in your session
- **Stuck Detection** — Automatically detect agents inactive for >5 minutes and alert with visual warnings
- **Terminal UI** — Real-time ANSI-formatted dashboard refreshing every 1 second with 4-section layout

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│             TeamActivityMonitor (Orchestrator)              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Simulated Collectors (Foundation)            │   │
│  │  • In-memory event emission (no SDK EventBus yet)   │   │
│  │  • Emits typed lifecycle events                      │   │
│  └─────────────────┬──────────────────────────────────┘   │
│                    │                                        │
│     ┌──────────────┼──────────────┬──────────────────┐     │
│     ▼              ▼              ▼                  ▼     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Monitor  │ │ Timeline │ │ Workitem │ │ Decision │    │
│  │ Collector│ │ Collector│ │Collector │ │ Collector│    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │
│       │            │            │            │            │
│     ┌─┴──────┬─────┴───────┬────┴────────┬──┴────────┐   │
│     ▼        ▼             ▼              ▼           ▼   │
│  ┌───────────────────────────────────────────────────┐   │
│  │      TerminalRenderer (Display Layer)             │   │
│  │  • Agent Board formatter                          │   │
│  │  • Work Tracker formatter                         │   │
│  │  • Decision Feed formatter                        │   │
│  │  • Timeline formatter                             │   │
│  └───────────────────────────────────────────────────┘   │
│                      │                                    │
│                      ▼                                    │
│           ┌────────────────────┐                          │
│           │ ANSI Terminal Output│                          │
│           │   [Real-time UI]   │                          │
│           └────────────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

## Data Sources (Simulated)

All data sources currently return **simulated/sample data**. No live API calls are made.

| Component | Current State | Future State |
|-----------|--------------|--------------|
| Platform adapters (GitHub/ADO) | Returns hard-coded sample work items | Real GitHub/ADO API calls |
| Agent status tracking | In-memory collectors | Subscribe to SDK `RuntimeEventBus` |
| Cost tracking | Manual data injection | Read from SDK `CostTracker` |
| Health monitoring | Manual data injection | Read from SDK `RalphMonitor` |
| Decision feed | Manual data injection | Read from SDK `SquadState` |

## Project Structure

```
src/
├── index.ts                          # Main entry point & public API
├── monitor.ts                        # TeamActivityMonitor orchestrator
├── core/
│   ├── eventbus-collector.ts         # EventBus subscription & event emission
│   ├── monitor-collector.ts          # Agent state tracking
│   ├── timeline-collector.ts         # Event timeline with filtering
│   └── types.ts                      # Shared types (AgentState, EventType, etc)
├── collectors/
│   ├── work-item-collector.ts        # Work item tracking from platform
│   ├── decision-collector.ts         # Decision feed from SquadState
│   ├── cost-collector.ts             # Cost tracking from CostTracker
│   ├── health-collector.ts           # Health indicators from RalphMonitor
│   ├── file-change-collector.ts      # File modification tracking
│   └── stuck-detector.ts             # Stuck agent detection (5min threshold)
├── adapters/
│   ├── work-item-adapter.ts          # Platform adapter wrapper (GitHub/ADO)
│   └── platform-adapter-factory.ts   # Factory for creating platform adapters
└── renderers/
    ├── terminal-renderer.ts          # Main ANSI rendering orchestrator
    ├── ansi-utils.ts                 # ANSI color/formatting utilities
    └── formatters/
        ├── agent-board.ts            # Agent table formatting
        ├── work-tracker.ts           # Work item formatting
        ├── decision-feed.ts          # Decision list formatting
        ├── timeline.ts               # Timeline formatting
        ├── cost-ticker.ts            # Cost display
        ├── health-indicator.ts       # Health status
        ├── file-changes.ts           # File change summary
        └── alerts.ts                 # Alert display

test/
└── [Mirror of src/ structure with .test.ts files]
```

## Getting Started

### Prerequisites

- Node.js 18+ with npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bradygaster/project-squad-sdk-example-monitor.git
cd project-squad-sdk-example-monitor

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Build & Test

```bash
# Build the project
npm run build

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Configuration

The monitor is configured at runtime via the `TeamActivityMonitor` constructor and `start()` method. No configuration file is needed for basic operation.

**Key configuration points:**

1. **Platform Adapter** — Use `PlatformAdapterFactory` to select GitHub or Azure DevOps (currently returns simulated data)
2. **Render Interval** — Default 1s; modify `TeamActivityMonitor.start()` line 52 to adjust
3. **Stuck Threshold** — Default 5 minutes; modify in `StuckDetector` constructor

**Example initialization:**

```typescript
import { TeamActivityMonitor } from '@bradygaster/project-squad-sdk-example-monitor';

const monitor = new TeamActivityMonitor();
await monitor.start();

// Monitor runs in background, rendering to terminal every 1s
// Press Ctrl+C to stop gracefully
```

## Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for a step-by-step walkthrough of starting your first monitoring session.

## Future: SDK Integration

This prototype is designed to eventually integrate with `@bradygaster/squad-sdk`. Here's what real integration would look like:

1. **EventBus subscription** — Replace the in-memory event emitter with `runtime.EventBus` from the SDK to receive real agent lifecycle events (`agent.idle`, `agent.working`, `agent.completed`, `agent.failed`).
2. **Live platform adapters** — Replace the simulated `fetchWorkItems()` stubs with calls to `platform.createPlatformAdapter()` from the SDK, which connects to the GitHub and Azure DevOps APIs using real credentials.
3. **Cost tracking** — Wire `CostCollector` to `runtime.CostTracker` to pull real token consumption and estimated cost data per agent session.
4. **Health monitoring** — Connect `HealthCollector` to `ralph.RalphMonitor` for live circuit breaker state, rate limit status, and error counts.
5. **State management** — Use `state.SquadState` to read team decisions, agent assignments, and squad configuration instead of manual data injection.

Once the SDK exposes these modules as stable APIs, the monitor can be upgraded from simulated to live data with minimal changes to the collector interfaces.

## Known Limitations (Phase 1)

- **Single instance only** — EventBus is in-process; no cross-repo visibility
- **Terminal only** — No web UI (Phase 2)
- **No persistence** — History lost on process exit
- **No authentication** — Single-user only
- **Manual refresh** — Dashboard updates every 1s; not real-time push

## Phase 2 Roadmap

- Cross-repo event aggregation
- Web dashboard UI
- Multi-user authentication
- Historical replay with data persistence
- Org-wide squad discovery integration

## Testing

The project uses [Vitest](https://vitest.dev/) for unit and integration tests. All collectors, adapters, formatters, and the main monitor are tested with >80% coverage target.

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
```

## Architecture Decisions

See [PLAN.md](./PLAN.md) for the detailed TDD implementation plan, including:
- Feature group specifications with acceptance criteria
- Dependency graph and build order
- Testing strategy
- Phase 1 and Phase 2 roadmap

## Contributing

1. Create a feature branch: `git checkout -b squad/N-feature-name`
2. Write tests first (TDD)
3. Implement the feature
4. Ensure all tests pass: `npm run test`
5. Open a pull request

## License

See LICENSE in the repository root.
