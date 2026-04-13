// Shared types for the monitor

export enum AgentState {
  IDLE = 'idle',
  WORKING = 'working',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface AgentStatus {
  agentId: string;
  state: AgentState;
  duration: number; // milliseconds
  currentTask: string;
  lastActivityTime: Date;
}

export enum EventType {
  AGENT_IDLE = 'agent_idle',
  AGENT_WORKING = 'agent_working',
  AGENT_COMPLETED = 'agent_completed',
  AGENT_FAILED = 'agent_failed',
  DECISION_MADE = 'decision_made',
  WORK_ITEM_UPDATED = 'work_item_updated',
  ERROR = 'error',
  AGENT_STUCK = 'agent_stuck',
}

export interface TimelineEntry {
  timestamp: Date;
  type: EventType;
  agentId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export enum WorkItemStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

export interface WorkItem {
  id: string;
  title: string;
  assigneeAgent?: string;
  status: WorkItemStatus;
  createdAt: Date;
  updatedAt: Date;
  platform: 'github' | 'ado';
}

export interface Decision {
  id: string;
  title: string;
  timestamp: Date;
  author: string;
  status: string;
}

export interface CostData {
  agentId: string;
  tokens: number;
  estimatedCost: number;
  startTime: Date;
  duration: number;
}

export interface HealthStatus {
  agentId: string;
  circuitBreakerOpen: boolean;
  rateLimited: boolean;
  errorCount: number;
  lastError?: Date;
}

export interface FileChange {
  filepath: string;
  agentId: string;
  timestamp: Date;
  changeType: 'create' | 'modify' | 'delete';
}

export interface StuckAlert {
  agentId: string;
  duration: number;
  message: string;
}

export interface FileChangeSummary {
  filepath: string;
  count: number;
  lastAgent: string;
  lastTimestamp: Date;
}
