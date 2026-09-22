import { DataService } from './data.service';
import { ProgressService } from './progress.service';

export interface Milestone {
  id: string;
  label: string;
  /** topic keys (`${categoryId}/${topicId}`) that must all be 100% for this milestone */
  requires: string[];
}

export const MILESTONES: Milestone[] = [
  { id: 'ai200', label: 'AI-200 certification prep completed', requires: ['azure/ai200'] },
  { id: 'az900', label: 'AZ-900 certification prep completed', requires: ['azure/az900'] },
  { id: 'python', label: 'Python fundamentals completed', requires: ['python/udemy-course'] },
  {
    id: 'dsa-fundamentals',
    label: 'DSA fundamentals completed',
    requires: ['dsa/foundations', 'dsa/arrays', 'dsa/strings', 'dsa/math-bit', 'dsa/recursion', 'dsa/searching', 'dsa/sorting'],
  },
  {
    id: 'dsa-advanced',
    label: 'DSA advanced topics completed',
    requires: ['dsa/linkedlist', 'dsa/stack', 'dsa/queue', 'dsa/hashing', 'dsa/trees', 'dsa/heaps', 'dsa/graphs', 'dsa/dp', 'dsa/greedy'],
  },
  {
    id: 'dotnet-advanced',
    label: '.NET advanced topics completed',
    requires: [
      'dotnet/auth',
      'dotnet/efcore',
      'dotnet/design-patterns',
      'dotnet/clean-arch',
      'dotnet/redis',
      'dotnet/logging',
      'dotnet/signalr',
      'dotnet/unit-testing',
      'dotnet/elasticsearch',
      'dotnet/rate-limiting',
      'dotnet/rabbitmq',
      'dotnet/api-gateway',
      'dotnet/grpc',
      'dotnet/microservices',
    ],
  },
  { id: 'docker', label: 'Docker completed', requires: ['docker/docker-basics'] },
  { id: 'kubernetes', label: 'Kubernetes completed', requires: ['kubernetes/k8s-basics'] },
  { id: 'sql', label: 'SQL core completed', requires: ['sql/core'] },
  {
    id: 'final-prep',
    label: 'Final interview preparation completed',
    requires: ['devops/cicd', 'dotnet/career-prep', 'dsa/revision'],
  },
  { id: 'agentic-llm-apps', label: 'LLM Applications completed', requires: ['agentic/llm-apps'] },
  { id: 'agentic-tool-calling', label: 'Tool Calling completed', requires: ['agentic/tool-calling'] },
  { id: 'agentic-agents', label: 'AI Agents completed — first working agent built', requires: ['agentic/agents'] },
  { id: 'agentic-rag', label: 'RAG completed — working document Q&A app built', requires: ['agentic/rag'] },
  { id: 'agentic-mcp', label: 'MCP fundamentals completed', requires: ['agentic/mcp'] },
  { id: 'agentic-mcp-servers', label: 'Custom MCP Server built', requires: ['agentic/mcp-servers'] },
  { id: 'agentic-mcp-dotnet', label: 'MCP + .NET completed — agent wired to custom MCP server', requires: ['agentic/mcp-dotnet'] },
  { id: 'agentic-memory', label: 'Agent Memory completed', requires: ['agentic/agent-memory'] },
  { id: 'agentic-multi-agent', label: 'Multi-Agent Systems completed', requires: ['agentic/multi-agent'] },
  {
    id: 'agentic-production',
    label: 'AI Security, Observability & Production AI completed',
    requires: ['agentic/ai-security', 'agentic/ai-observability', 'agentic/production-ai'],
  },
  { id: 'agentic-capstone', label: 'AI Capstone Project completed — AI Developer Assistant shipped', requires: ['agentic/capstone'] },
];

export interface MilestoneStatus extends Milestone {
  achieved: boolean;
  pct: number;
}

export function computeMilestones(data: DataService, progress: ProgressService): MilestoneStatus[] {
  return MILESTONES.map((m) => {
    let done = 0;
    let total = 0;
    for (const key of m.requires) {
      const [categoryId, topicId] = key.split('/');
      const topic = data.getTopic(categoryId, topicId);
      if (!topic) continue;
      done += progress.topicDoneCount(topic);
      total += topic.items.length;
    }
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { ...m, achieved: pct === 100, pct };
  });
}
