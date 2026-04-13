# Quick Start — Team Activity Monitor

Get a monitoring dashboard running in 5 minutes. No code writing required.

## Prerequisites

- **Node.js 18+** — [download](https://nodejs.org/) or verify with `node --version`
- **npm 9+** — included with Node.js
- **git** — for cloning

Verify your environment:

```bash
node --version    # v18.0.0 or higher
npm --version     # 9.0.0 or higher
git --version     # 2.x.x or higher
```

## Step 1: Clone & Install

```bash
git clone https://github.com/bradygaster/project-squad-sdk-example-monitor.git
cd project-squad-sdk-example-monitor
npm install
```

**Expected:** `added 42 packages in ~3s`

## Step 2: Build

```bash
npm run build
```

**Expected:** TypeScript compiles to `dist/` with no errors.

## Step 3: Run Tests

```bash
npm run test
```

**Expected:** All tests pass (28+ tests in ~1-2s)

```
✓ src/core/eventbus-collector.test.ts (5 tests) 234ms
✓ src/core/monitor-collector.test.ts (4 tests) 187ms
✓ src/collectors/work-item-collector.test.ts (3 tests) 156ms
...
✓ 28 passed (1.2s)
```

## Step 4: Start Your First Monitor

Run the CLI — no script file needed:

```bash
npx squad-monitor start
```

**Expected output** (terminal updates every 3 seconds):

```
╔══════════════════════════════════════════╗
║     Team Activity Monitor Dashboard      ║
╚══════════════════════════════════════════╝

AGENTS
┌─────────────┬──────────┬──────────┬─────────────────┐
│ Agent ID    │ State    │ Duration │ Current Task    │
├─────────────┼──────────┼──────────┼─────────────────┤
│ Agent-001   │ working  │ 2.3s     │ Analyzing file  │
│ Agent-002   │ idle     │ 45.1s    │ -               │
│ Agent-003   │ completed│ 12.4s    │ ✓ Done          │
└─────────────┴──────────┴──────────┴─────────────────┘

WORK ITEMS
┌──────┬──────────────────────┬─────────────┬──────────┐
│ ID   │ Title                │ Assignee    │ Status   │
├──────┼──────────────────────┼─────────────┼──────────┤
│ #42  │ Fix login validation │ Agent-001   │ In Prog  │
│ #41  │ Add auth tests       │ Agent-002   │ Open     │
└──────┴──────────────────────┴─────────────┴──────────┘

DECISIONS
• 14:32:15 [Agent-001] Chose strategy: iterative_refine
• 14:32:08 [Agent-003] Decision: refactor_module_A

TIMELINE (last 50 events)
14:32:45 → Agent-001 transitioned to working
14:32:30 → Decision made: Code review strategy
```

Stop with **Ctrl+C**.

### One-Time Snapshot

To render the dashboard once and exit (great for CI or piping):

```bash
npx squad-monitor snapshot
```

## What You See

The dashboard has four live sections:

### **AGENTS** (Top Left)
Tracks the state of each agent:
- **Agent ID** — Unique identifier
- **State** — `idle`, `working`, `completed`, or `failed`
- **Duration** — Seconds in current state
- **Current Task** — What the agent is doing

### **WORK ITEMS** (Top Right)
GitHub/ADO issues assigned to agents:
- **ID** — Issue number (e.g., `#42`)
- **Title** — Issue description
- **Assignee** — Which agent has it
- **Status** — Open, In Progress, Completed, Blocked

### **DECISIONS** (Bottom Left)
Chronological decisions made by agents. Most recent first:
- Timestamp and decision text
- Which agent made it

### **TIMELINE** (Bottom Right)
All significant session events in order:
- Agent state transitions
- Decisions made
- Work item updates
- Errors and alerts

## Common Next Steps

### Run Tests in Watch Mode

For development, auto-run tests when files change:

```bash
npm run test:watch
```

### Check Code Coverage

See how thoroughly the code is tested (target: >80%):

```bash
npm run test:coverage
```

### Explore the API

The public API is in `src/index.ts`. Import individual collectors for programmatic use:

```typescript
import { 
  TeamActivityMonitor,
  MonitorCollector,
  WorkItemCollector,
  TimelineCollector,
  CostCollector,
  HealthCollector
} from 'project-squad-sdk-example-monitor';

const monitor = new TeamActivityMonitor();

// Access individual collectors
const agentMonitor = monitor.getMonitorCollector();
const workItems = monitor.getWorkItemCollector();
const timeline = monitor.getTimelineCollector();
```

### Write a Custom Collector

Add specialized tracking for your use case. See `src/collectors/` for examples and `README.md` → **Extending This Example** for detailed patterns.

## Troubleshooting

### `npm install` fails with permission errors

```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build fails with TypeScript errors

```bash
# Ensure TypeScript is installed
npm install -g typescript
npm run build
```

### Tests fail or crash

```bash
# Verify Node.js version (must be 18+)
node --version

# Reinstall and rebuild
npm install
npm run build
npm test
```

### Monitor doesn't display data

- Ensure Node.js version is 18+ (`node --version`)
- Verify the build succeeded (`npm run build`)
- Check that no errors appear when you run `npx squad-monitor snapshot`

## File Reference

```
project-squad-sdk-example-monitor/
├── src/                    # TypeScript source
│   ├── index.ts           # Public API (exports all collectors)
│   ├── monitor.ts         # Main orchestrator
│   ├── cli/               # CLI entry point (squad-monitor command)
│   │   └── index.ts       # start / snapshot commands
│   ├── core/              # Foundation (EventBus, Monitor, Timeline)
│   ├── collectors/        # Data collectors (Work, Decision, Cost, Health, etc)
│   ├── adapters/          # Platform adapters (GitHub, ADO)
│   └── renderers/         # Terminal formatting
├── dist/                  # Compiled JavaScript (generated)
├── test/                  # Unit & integration tests
├── package.json           # Scripts & dependencies
├── tsconfig.json          # TypeScript config
├── vitest.config.ts       # Test config
└── README.md              # Full documentation
```

## What's Next?

- **Full docs:** Read [README.md](./README.md) for architecture, extending, and SDK integration
- **Specifications:** Check [PLAN.md](./PLAN.md) for detailed feature specs
- **Code examples:** Browse `test/` files to see how each component works
- **Type definitions:** See `src/core/types.ts` for all exported types

## Getting Help

| Question | Answer |
|----------|--------|
| "What can I import?" | Check `src/index.ts` |
| "What types are available?" | See `src/core/types.ts` |
| "How do I use [component]?" | Look at `test/[component].test.ts` |
| "Build won't work?" | Run `npm install` and `npm run build` with verbose output |

---

**Happy monitoring! 🚀**
