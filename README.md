# Team Activity Monitor

Real-time terminal dashboard for monitoring Squad agent activity, work items, decisions, and resource consumption. Phase 1 focuses on single-team telemetry with support for agent status, cost tracking, health monitoring, and event timelines.

> **Current State:** Data sources are simulated. See [Future: SDK Integration](#future-sdk-integration) for planned live integration with Squad SDK.

## Using This Example

### Prerequisites

- **Node.js 18+** ([download](https://nodejs.org/)) — verify with `node --version`
- **npm 9+** (included with Node.js) — verify with `npm --version`

### Installation

```bash
git clone https://github.com/bradygaster/project-squad-sdk-example-monitor.git
cd project-squad-sdk-example-monitor
npm install
npm run build
```

### Start Monitoring

Create a simple script `monitor.mjs`:

```javascript
import { TeamActivityMonitor } from './dist/index.js';

const monitor = new TeamActivityMonitor();
console.log('🚀 Starting Team Activity Monitor...\n');
await monitor.start();
console.log('✓ Monitor running. Press Ctrl+C to stop.\n');
```

Run it:

```bash
node monitor.mjs
```

### Expected Output

The terminal displays a 4-section dashboard updating every 1 second:

```
╔════════════════════════════════════════════════════════════╗
║              TEAM ACTIVITY MONITOR DASHBOARD                ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ AGENTS                                                     ║
║ ┌─────────────┬──────────┬──────────┬─────────────────┐   ║
║ │ Agent ID    │ State    │ Duration │ Current Task    │   ║
║ ├─────────────┼──────────┼──────────┼─────────────────┤   ║
║ │ Agent-001   │ working  │ 2.3s     │ Analyzing file  │   ║
║ │ Agent-002   │ idle     │ 45.1s    │ -               │   ║
║ │ Agent-003   │ completed│ 12.4s    │ ✓ Done          │   ║
║ └─────────────┴──────────┴──────────┴─────────────────┘   ║
║                                                            ║
║ WORK ITEMS                                                 ║
║ ┌──────┬──────────────────────┬─────────────┬──────────┐  ║
║ │ ID   │ Title                │ Assignee    │ Status   │  ║
║ ├──────┼──────────────────────┼─────────────┼──────────┤  ║
║ │ #42  │ Fix login validation │ Agent-001   │ In Prog  │  ║
║ │ #41  │ Add auth tests       │ Agent-002   │ Open     │  ║
║ └──────┴──────────────────────┴─────────────┴──────────┘  ║
║                                                            ║
║ DECISIONS                                                  ║
║ • 14:32:15 [Agent-001] Chose strategy: iterative_refine  ║
║ • 14:32:08 [Agent-003] Decision: refactor_module_A      ║
║                                                            ║
║ TIMELINE (last 50 events)                                 ║
║ 14:32:45 → Agent-001 transitioned to working              ║
║ 14:32:30 → Decision made: Code review strategy            ║
║ 14:32:15 → Work item #42 updated to in_progress          ║
║ 14:32:00 → Agent-003 completed work                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

💰 Cost: $0.42 | Rate: 150 tokens/min | Budget: $50.00
🟢 Agents: 3 healthy, 0 rate-limited, 0 circuit-open
```

### Dashboard Sections

| Section | Shows | Key Columns |
|---------|-------|-------------|
| **AGENTS** | Active agents in this session | ID, State (idle/working/completed/failed), Duration, Current Task |
| **WORK ITEMS** | GitHub/ADO issues assigned to agents | Issue ID, Title, Assignee, Status |
| **DECISIONS** | Decisions made by agents (chronological) | Timestamp, Agent, Decision text |
| **TIMELINE** | All session events in order | Timestamp, Event type, Details |

### Configuration

The monitor works out of the box with sensible defaults. No config file required. Customize by editing your script:

```javascript
import { TeamActivityMonitor } from './dist/index.js';

const monitor = new TeamActivityMonitor();

// Customize individual collectors
const agentMonitor = monitor.getMonitorCollector();
const workTracker = monitor.getWorkItemCollector();
const timelineCollector = monitor.getTimelineCollector();

// Example: Get only specific event types from timeline
const transitions = timelineCollector.getTimeline({ 
  eventType: 'AGENT_TRANSITION' 
});

await monitor.start();
```

## Extending This Example

### Adding Custom Collectors

Create a new collector following the pattern:

```typescript
// src/collectors/custom-collector.ts
import { TimelineEvent, EventType } from '../core/types';

export class CustomCollector {
  private data: any[] = [];

  process(event: TimelineEvent): void {
    // Your custom processing
    this.data.push(event);
  }

  getData(): any[] {
    return this.data;
  }
}
```

Subscribe it to the EventBus:

```typescript
import { TeamActivityMonitor } from './dist/index.js';
import { CustomCollector } from './dist/collectors/custom-collector.js';

const monitor = new TeamActivityMonitor();
const customCollector = new CustomCollector();

// Subscribe to event bus
const eventBus = monitor.getEventBusCollector();
eventBus.on('agent.transition', (event) => {
  customCollector.process(event);
});

await monitor.start();
```

### Integrating with Real Squad SDK EventBus

When `@bradygaster/squad-sdk` exposes its `RuntimeEventBus`, replace the simulated EventBus:

```typescript
import { getRuntimeEventBus } from '@bradygaster/squad-sdk';
import { EventBusCollector } from './dist/index.js';

// Replace simulated EventBus with live one
const liveEventBus = await getRuntimeEventBus();
const collector = new EventBusCollector(liveEventBus);

// Now all events are real squad agent data
```

### Adding Custom Formatters

Create a renderer for any new data source:

```typescript
// src/renderers/formatters/custom-formatter.ts
import { AnsiUtils } from '../ansi-utils';

export class CustomFormatter {
  format(data: any[]): string {
    const lines = data.map(item => 
      `${AnsiUtils.bold(item.id)}: ${item.value}`
    );
    return AnsiUtils.box(lines.join('\n'), 'Custom Data');
  }
}
```

Add it to the TerminalRenderer and integrate into the dashboard layout.

### Architecture Overview

```
                    ┌──────────────────┐
                    │   EventBus       │
                    │  (simulated)     │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    ┌─────────────┐   ┌──────────────┐  ┌─────────────┐
    │ MonitorColl │   │ WorkItemColl │  │ TimelineColl│
    │ (agents)    │   │ (issues)     │  │ (events)    │
    └────┬────────┘   └──────┬───────┘  └──────┬──────┘
         │                   │                  │
         └───────────────────┼──────────────────┘
                             │
                      ┌──────▼───────┐
                      │Terminal      │
                      │Renderer      │
                      │(formatters)  │
                      └──────┬───────┘
                             │
                      ┌──────▼──────┐
                      │ANSI Terminal│
                      └─────────────┘
```

**Components:**

- **EventBusCollector** — Subscribes to agent/decision/cost events; emits typed timeline events
- **MonitorCollector** — Tracks agent state transitions (idle → working → done)
- **WorkItemCollector** — Polls platform adapters for GitHub/ADO issues
- **TimelineCollector** — Builds scrollable event log
- **Other Collectors** — Cost, Health, FileChange, StuckDetector (see src/collectors/)
- **TerminalRenderer** — Formats each collector's data into ANSI dashboard

## Project Structure

```
src/
├── index.ts                    # Public API exports
├── monitor.ts                  # Orchestrator (start, stop, collect)
├── core/
│   ├── eventbus-collector.ts   # Event emission (simulated or live)
│   ├── monitor-collector.ts    # Agent state tracking
│   ├── timeline-collector.ts   # Event timeline with filtering
│   └── types.ts                # Shared types (EventType, AgentState, etc)
├── collectors/
│   ├── work-item-collector.ts  # GitHub/ADO work items
│   ├── decision-collector.ts   # Squad decisions
│   ├── cost-collector.ts       # Token cost tracking
│   ├── health-collector.ts     # Circuit breaker, rate limits
│   ├── file-change-collector.ts# File modifications
│   └── stuck-detector.ts       # Inactive agent alerts
├── adapters/
│   ├── work-item-adapter.ts    # Platform API wrapper
│   └── platform-adapter-factory.ts # GitHub/ADO factory
└── renderers/
    ├── terminal-renderer.ts    # Dashboard orchestrator
    ├── ansi-utils.ts           # Colors, boxes, tables
    └── formatters/
        ├── agent-board.ts      # Agent table
        ├── work-tracker.ts     # Issue table
        ├── decision-feed.ts    # Decision list
        ├── timeline.ts         # Event timeline
        ├── cost-ticker.ts      # Cost display
        ├── health-indicator.ts # Health status
        ├── file-changes.ts     # File summary
        └── alerts.ts           # Warnings
```

## SDK Modules

The monitor currently uses these simulated Squad SDK concepts:

| Module | Used For | Future SDK Path |
|--------|----------|-----------------|
| `EventType` (types) | Event classification | `@bradygaster/squad-sdk/runtime` |
| `AgentState` (types) | Agent lifecycle | `@bradygaster/squad-sdk/runtime` |
| Platform adapters | Work item fetching | `@bradygaster/squad-sdk/platform` |
| Cost tracking | Token accounting | `@bradygaster/squad-sdk/observability` |
| Health monitoring | Circuit breaker state | `@bradygaster/squad-sdk/health` |

## Testing

```bash
npm run test              # Run all tests once
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report (target: >80%)
```

Collectors and formatters are tested with >80% coverage. See `test/` for patterns.

## Roadmap

**Phase 1 (Current)**
- Single-team terminal dashboard
- Simulated data sources
- 4-section layout (agents, work, decisions, timeline)
- Cost and health tracking

**Phase 2**
- Cross-repo event aggregation
- Web dashboard UI
- Multi-user authentication
- Historical replay with persistence
- Org-wide squad discovery

## Future: SDK Integration

When `@bradygaster/squad-sdk` releases stable APIs, this example will upgrade to live data:

1. **EventBus** — Use `runtime.EventBus` instead of simulated emitter
2. **Platform adapters** — Real GitHub/ADO API calls via `platform.createPlatformAdapter()`
3. **Cost tracking** — Pull from `runtime.CostTracker`
4. **Health monitoring** — Subscribe to `ralph.RalphMonitor` alerts
5. **Decisions** — Read from `state.SquadState` instead of manual injection

All collector interfaces are designed to support this transition without breaking changes.

## Contributing

1. Create a feature branch: `git checkout -b squad/N-feature-name`
2. Write tests first (TDD)
3. Implement feature
4. Run `npm run test` to verify
5. Open a pull request

## License

See LICENSE in the repository root.
