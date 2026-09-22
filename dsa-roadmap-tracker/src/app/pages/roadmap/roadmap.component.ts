import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ProgressService } from '../../core/progress.service';
import { DayGroup, WeekGroup } from '../../core/models';

interface WeekMeta {
  objective: string;
  outcome: string;
  practice: string;
  interviewPrep: string;
  revision: string;
}

// Short, human-written summaries per week, derived from what that week's days
// actually contain (see scripts/generate-data.mjs for the source topics —
// this is precisely computed from the real day ranges, not approximate).
const WEEK_META: Record<number, WeekMeta> = {
  1: { objective: 'Kick off AI-200, DSA foundations, JWT auth on the Web API, and LLM Applications (building starts day 1 — no AI theory)', outcome: 'Comfortable with containerized Azure AI basics, DSA complexity basics, a running Web API with JWT, and calling LLM APIs directly from code', practice: 'ACR/App Service hands-on, JWT auth in the API, stream an LLM response in a console app', interviewPrep: 'Big-O explanation, container vs VM, what a context window is', revision: 'Re-read AI-200 skills outline' },
  2: { objective: 'AI-200 continues, DSA arrays deep-dive, EF Core, finish LLM Applications and start Tool Calling', outcome: 'Solid on array patterns; EF Core relationships understood; first LLM app that calls a real tool', practice: 'Array two-pointer & sliding window problems, a tool-calling app with 1 tool', interviewPrep: 'EF Core loading strategies, tool schema design', revision: 'Arrays topic checklist' },
  3: { objective: 'AI-200 continues, Arrays wrap-up, Design Patterns begin, finish Tool Calling and start AI Agents', outcome: 'Arrays module nearly complete; Repository/Factory patterns applied; the agent loop makes sense', practice: 'Kadane’s algorithm & 2D array problems, a multi-tool app, start building your first agent', interviewPrep: 'Repository pattern trade-offs, agent vs a plain LLM call', revision: 'Arrays + Tool Calling' },
  4: { objective: 'AI-200 exam window closes, AZ-900 begins, DSA strings, Clean Architecture, and AI Agents continue', outcome: 'AI-200 exam attempted; string manipulation fluent; Clean Architecture layers applied; agent planning & state understood', practice: 'String two-pointer problems, restructure into Clean Architecture, build your agent’s task decomposition', interviewPrep: 'Full AI-200 practice tests, Clean Architecture layer responsibilities', revision: 'AI Agents concepts so far' },
  5: { objective: 'AZ-900 continues, DSA strings wrap / math & bit, Redis caching, and finish AI Agents + start RAG', outcome: 'String module complete; caching strategy understood; a working agent that completes a multi-step task; RAG concept clear', practice: 'Bit manipulation problems, cache a heavy query, finish your agent build with guardrails', interviewPrep: 'Cache invalidation strategies, explain your agent’s guardrails', revision: 'AI Agents, end to end' },
  6: { objective: 'AZ-900 continues, DSA recursion, Logging & Monitoring, and RAG — build a document Q&A app', outcome: 'Recursion mental model solid; structured logging in place; a working RAG pipeline with citations', practice: 'Recursive problems, add correlation IDs to the API, chunk + embed + store + query a real document set', interviewPrep: 'Call stack & base cases, chunking strategy trade-offs', revision: 'AZ-900 cloud concepts' },
  7: { objective: 'AZ-900 wraps up with exam, DSA recursion/searching/sorting, Docker fundamentals, and MCP fundamentals', outcome: 'AZ-900 exam attempted; searching & sorting fluent; first Docker images built; MCP’s Host/Client/Server model understood', practice: 'Binary search & sort implementations, Dockerize a small app', interviewPrep: 'Full AZ-900 practice tests, MCP vs plain tool calling', revision: 'Recursion + Searching' },
  8: { objective: 'DSA sorting wraps + revision, SignalR, and start building a custom MCP Server', outcome: 'All major sorts fluent; real-time notifications working; first MCP server with a working tool', practice: 'Sort & revision problems, a hello-world MCP server + first custom tool', interviewPrep: 'Sorting complexity comparisons, MCP Tools vs Resources vs Prompts', revision: 'Sorting + MCP fundamentals' },
  9: { objective: 'DSA LinkedList, Unit Testing, and MCP Server build continues (multiple tools, validation, error handling)', outcome: 'Linked list operations fluent; API has test coverage; MCP server has multiple validated tools', practice: 'Reverse/cycle-detect a linked list, xUnit/Moq tests, add input validation to your MCP tools', interviewPrep: 'Array vs linked list trade-offs, how you validate MCP tool input', revision: 'LinkedList topic checklist' },
  10: { objective: 'DSA LinkedList wraps + Stack, Elasticsearch, and finish your custom MCP Server (DB/API integration, security, deploy)', outcome: 'Stack operations fluent; search feature implemented; a tested, deployed MCP server with real API/DB-backed tools', practice: 'Balanced parentheses problems, wire a database call into an MCP tool', interviewPrep: 'Stack use cases, MCP server security basics', revision: 'MCP Servers topic, end to end' },
  11: { objective: 'DSA Queue/Hashing, Rate Limiting + Kubernetes begins, and start MCP + .NET (a real ASP.NET Core MCP server)', outcome: 'Queue & hashing patterns fluent; first K8s deployment; first C# MCP tool running', practice: 'Two-sum family & queue problems, first ASP.NET Core MCP tool', interviewPrep: 'Hashing collision handling, DI inside an MCP server', revision: 'Queue + Hashing' },
  12: { objective: 'DSA Hashing wraps + Trees begin, Kubernetes/RabbitMQ, and MCP + .NET continues (SQL Server integration)', outcome: 'Tree traversals fluent; K8s deployment skills solid; MCP tools that safely query SQL Server', practice: 'BST insert/search problems, an MCP tool backed by SQL Server', interviewPrep: 'BFS vs DFS on trees, safe parameterized queries from a tool', revision: 'Hashing + start of Trees' },
  13: { objective: 'DSA Trees continue, RabbitMQ, and MCP + .NET continues (REST API integration, auth)', outcome: 'Tree module strong; producer/consumer patterns in .NET; MCP tools that call REST APIs securely', practice: 'Tree practice problems, add authentication to your .NET MCP server', interviewPrep: 'Queue vs exchange vs routing key, auth for an MCP server', revision: 'Trees, end to end' },
  14: { objective: 'DSA Trees wrap + Heaps + Graphs begin, API Gateway/gRPC, and finish MCP + .NET by wiring an Agent to your custom MCP server, start AI Security', outcome: 'Heap problems fluent; gateway routes to multiple services; an agent that discovers and uses tools from your own MCP server; prompt injection understood', practice: 'Kth largest/top-k problems, connect your agent to your MCP server end-to-end', interviewPrep: 'gRPC vs REST, how an agent discovers MCP tools, prompt injection defenses', revision: 'MCP + .NET, full pipeline' },
  15: { objective: 'DSA Graphs wrap + DP begins, gRPC/Microservices begin, and Multi-Agent Systems + AI Observability', outcome: 'Graph algorithms fluent; two services talking via RabbitMQ + gateway; a working multi-agent workflow; know what to log/trace for an agent', practice: 'Connected components problems, build your researcher + writer + reviewer agent workflow', interviewPrep: 'Orchestration vs choreography, what a good agent trace should capture', revision: 'Graphs traversal patterns' },
  16: { objective: 'DSA DP wraps + Greedy, Microservices + DevOps CI/CD begins, and Production AI + AI Capstone begins', outcome: 'DP/Greedy patterns solid; CI/CD pipeline live for the Web API; know how to evaluate and gate risky agent actions; capstone planning done', practice: 'Knapsack/LCS problems, set up your first Azure DevOps pipeline, add a human-approval step to an agent', interviewPrep: 'Memoization vs tabulation, how you’d evaluate a RAG pipeline’s answers', revision: 'DP + Greedy' },
  17: { objective: 'Final DSA revision + mock interviews, DevOps wraps + career prep, and the AI Capstone Project finishes — your AI Developer Assistant', outcome: 'Full 100-day plan complete: DSA revision-ready, both .NET projects have CI/CD, and a working end-to-end AI Developer Assistant (Angular + agent + MCP + RAG + Azure)', practice: 'Final mixed DSA practice, finish and deploy the capstone project', interviewPrep: 'Full-stack mock interview across all topics, walk through your capstone architecture', revision: 'Everything — final pass across DSA, .NET, and Agentic AI' },
};

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css',
})
export class RoadmapComponent {
  readonly weeks: WeekGroup[];
  expandedWeek: WritableSignal<number>;

  constructor(readonly data: DataService, readonly progress: ProgressService) {
    this.weeks = data.weeks;
    const startWeek = Math.min(Math.ceil(progress.currentDay() / 6) || 1, this.weeks.length);
    this.expandedWeek = signal<number>(startWeek);
  }

  meta(week: number): WeekMeta {
    return WEEK_META[week] ?? { objective: 'Continue the plan', outcome: '', practice: '', interviewPrep: '', revision: '' };
  }

  weekDoneCount(w: WeekGroup): number {
    return w.days.reduce((sum, d) => sum + d.items.filter((i) => this.progress.isChecked(i.id)).length, 0);
  }

  weekTotalCount(w: WeekGroup): number {
    return w.days.reduce((sum, d) => sum + d.items.length, 0);
  }

  weekPct(w: WeekGroup): number {
    const total = this.weekTotalCount(w);
    return total === 0 ? 0 : Math.round((this.weekDoneCount(w) / total) * 100);
  }

  weekHours(w: WeekGroup): number {
    const minutes = w.days.flatMap((d) => d.items).reduce((sum, i) => sum + i.minutes, 0);
    return Math.round((minutes / 60) * 10) / 10;
  }

  dayDoneCount(day: DayGroup): number {
    return day.items.filter((i) => this.progress.isChecked(i.id)).length;
  }

  isDayComplete(day: DayGroup): boolean {
    return this.dayDoneCount(day) === day.items.length;
  }

  toggleWeek(week: number): void {
    this.expandedWeek.set(this.expandedWeek() === week ? -1 : week);
  }

  isWeekExpanded(week: number): boolean {
    return this.expandedWeek() === week;
  }

  jumpToCurrent(): void {
    const day = this.progress.currentDay();
    const week = Math.min(Math.ceil(day / 6) || 1, this.weeks.length);
    this.expandedWeek.set(week);
    setTimeout(() => {
      try {
        document.getElementById('day-' + day)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {
        /* ignore */
      }
    }, 0);
  }

  subjectClass(categoryId: string): string {
    return 'subject-' + categoryId;
  }
}
