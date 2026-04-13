# Quick Start Guide — Team Activity Monitor

Get up and running with the Team Activity Monitor in 5 minutes.

## Prerequisites

- **Node.js 18+** ([download](https://nodejs.org/))
- **npm 9+** (comes with Node.js)
- **git** (for cloning)

Verify your setup:
```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
git --version     # Should be 2.x.x or higher
```

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/bradygaster/project-squad-sdk-example-monitor.git
cd project-squad-sdk-example-monitor

# Install dependencies
npm install

# Verify installation
npm list @bradygaster/squad-sdk
```

**Expected output:**
```
added 42 packages in 3.5s
```

## Step 2: Build the Project

```bash
npm run build
```

**Expected output:**
```
✓ Successfully compiled 28 files
```

The compiled JavaScript is output to `dist/` directory.

## Step 3: Run the Tests

```bash
npm run test
```

**Expected output:**
```
✓ src/core/eventbus-collector.test.ts (5 tests) 234ms
✓ src/core/monitor-collector.test.ts (4 tests) 187ms
✓ src/collectors/work-item-collector.test.ts (3 tests) 156ms
✓ src/collectors/decision-collector.test.ts (3 tests) 142ms
...

✓ 28 passed (1.2s)
```

If tests fail, check that all dependencies installed correctly with `npm install`.

## Step 4: Your First Monitoring Session

The monitor integrates with the Squad SDK. Here's how to use it in your own code:

### Create a simple monitor script

Create `my-monitor.ts`:

```typescript
import { 
  TeamActivityMonitor,
  EventBusCollector,
  MonitorCollector,
  WorkItemCollector,
  DecisionCollector,
  TimelineCollector,
  TerminalRenderer
} from './dist/index.js';

// Initialize the monitor
const monitor = new TeamActivityMonitor();

// Start monitoring with 1s refresh interval
console.log('🚀 Starting Team Activity Monitor...\n');
await monitor.start();

console.log('✓ Monitor is running');
console.log('✓ Agent board is live');
console.log('✓ Timeline is streaming events');
console.log('\n📊 Press Ctrl+C to stop\n');

// Graceful shutdown handled by monitor (Ctrl+C)
```

### Run the monitor

```bash
# Build your script
npx tsc my-monitor.ts --module esnext --target es2020

# Run it
node my-monitor.js
```

**Expected terminal output:**

```
🚀 Starting Team Activity Monitor...

✓ Monitor is running
✓ Agent board is live
✓ Timeline is streaming events

📊 Press Ctrl+C to stop

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
║ • 14:32:15 [Agent-001] Chose strategy: iterative_refinement
║ • 14:32:08 [Agent-003] Decision: refactor_module_A
║                                                            ║
║ TIMELINE (last 10 events)                                  ║
║ 14:32:45 → Agent-001 transitioned to working               ║
║ 14:32:30 → Decision made: Code review strategy             ║
║ 14:32:15 → Work item #42 updated to in_progress           ║
║ 14:32:00 → Agent-003 completed work                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

💰 Cost: $0.42 | Rate: 150 tokens/min | Budget: $50.00
🟢 Agents: 3 healthy, 0 rate-limited, 0 circuit-open
```

## Step 5: Understanding the Dashboard

The terminal dashboard has four main sections:

### **AGENTS** (Top Left)
- **Agent ID** — Unique identifier
- **State** — Current status (idle, working, completed, failed)
- **Duration** — How long in current state
- **Current Task** — What the agent is doing

### **WORK ITEMS** (Top Right)
- **ID** — GitHub/ADO issue number
- **Title** — Issue title
- **Assignee** — Which agent is assigned
- **Status** — Open, In Progress, Completed, Blocked

### **DECISIONS** (Bottom Left)
- Chronological feed of decisions made by agents
- Timestamp and decision title
- Most recent at the top

### **TIMELINE** (Bottom Right)
- Stream of all significant events
- Agent state transitions, decisions, work updates, errors
- Last 50 events shown (scrollable)

## Common Next Steps

### 1. **Monitor a Live Squad Session**

Integrate with an actual Squad task:

```typescript
import { getRuntimeEventBus } from '@bradygaster/squad-sdk';
import { TeamActivityMonitor } from './dist/index.js';

// Get the Squad SDK EventBus
const eventBus = await getRuntimeEventBus();

// Create and start monitor
const monitor = new TeamActivityMonitor();
await monitor.start();

// Run your agent work...
// Monitor will automatically track all events
```

### 2. **Customize Collectors**

Import individual collectors for specific monitoring:

```typescript
import { 
  MonitorCollector,
  WorkItemCollector,
  CostCollector 
} from './dist/index.js';

const agentMonitor = new MonitorCollector();
const workTracker = new WorkItemCollector();
const costTracker = new CostCollector();

// Use individually in your own dashboard
```

### 3. **Filter Timeline Events**

Get only specific event types:

```typescript
const monitor = new TeamActivityMonitor();
const timeline = monitor.getTimelineCollector();

// Get only agent state transitions
const transitions = timeline.getTimeline({ 
  eventType: 'AGENT_TRANSITION' 
});

// Get only errors
const errors = timeline.getTimeline({ 
  eventType: 'ERROR' 
});
```

### 4. **Export Cost Data**

Track session costs:

```typescript
const monitor = new TeamActivityMonitor();
const costData = monitor.getMonitor
Collector().getSessionCost();

console.log(`Total session cost: $${costData.estimatedCost}`);
console.log(`Tokens used: ${costData.tokens}`);
console.log(`Rate: ${costData.tokensPerMinute} tokens/min`);
```

### 5. **Watch Mode Development**

For continuous testing during development:

```bash
npm run test:watch
```

This runs tests automatically whenever you save a file.

### 6. **Check Code Coverage**

See how thoroughly the code is tested:

```bash
npm run test:coverage
```

Target is >80% coverage for all modules.

## Troubleshooting

### Issue: `npm install` fails

**Solution:** Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails with TypeScript errors

**Solution:** Make sure you have TypeScript installed globally:
```bash
npm install -g typescript
npm run build
```

### Issue: Tests fail

**Solution:** Verify your Node.js version:
```bash
node --version    # Should be v18+
npm install       # Reinstall dependencies
npm run build     # Rebuild
npm test          # Run tests again
```

### Issue: Monitor doesn't show data

**Solution:** Make sure you're passing a live EventBus:
```typescript
import { getRuntimeEventBus } from '@bradygaster/squad-sdk';

const eventBus = await getRuntimeEventBus();
// Ensure eventBus is from an active Squad session
```

## File Structure Reference

```
project-squad-sdk-example-monitor/
├── src/                    # TypeScript source
│   ├── core/              # Foundation (EventBus, Monitor, Timeline)
│   ├── collectors/        # Data collectors (Work, Decision, Cost, Health, etc)
│   ├── adapters/          # Platform adapters (GitHub, ADO)
│   ├── renderers/         # Terminal rendering
│   ├── monitor.ts         # Main orchestrator
│   └── index.ts           # Public API
├── test/                  # Unit & integration tests
├── dist/                  # Compiled JavaScript (generated)
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── vitest.config.ts       # Test config
├── README.md              # Full documentation
└── QUICKSTART.md          # This file
```

## What's Next?

- Read [README.md](./README.md) for the full architecture and API reference
- Review [PLAN.md](./PLAN.md) for the detailed feature specification
- Explore the test files in `test/` to see how to use each component
- Check out the TypeScript types in `src/core/types.ts`

## Getting Help

- **API Questions:** Check `src/index.ts` for exported public API
- **Type Definitions:** See `src/core/types.ts` for interfaces
- **Examples:** Look at test files for usage patterns
- **Build Issues:** Run `npm run build` and check error messages

---

**Happy monitoring! 🚀**
