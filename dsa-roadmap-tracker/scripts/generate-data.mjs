// Single source of truth generator.
// Writes src/assets/items.json — a FLAT array of LearningItem.
// Both the weekly roadmap (grouped by `day`) and the Topic Library
// (grouped by `categoryId` -> `topicId`) are derived from this SAME
// array in the Angular app (see data.service.ts), so there is only
// ever one place progress can live: checked[item.id].
//
// Run with: node scripts/generate-data.mjs
// Re-run after editing anything below, then rebuild the app.

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Day-level content (kept identical to the existing roadmap — nothing removed)
// ---------------------------------------------------------------------------

const AI200 = [
  'Azure Container Registry — build, store, version & manage container images; ACR Tasks build & run',
  'Deploy containers to Azure App Service (env vars & secrets); Container Apps — deployment & environment config',
  'Container Apps — revision management, KEDA event-driven autoscaling',
  'AKS — deploy & manage applications via manifest files',
  'AKS & Container Apps — monitor & troubleshoot (logs, events, end-to-end connectivity)',
  'Azure Cosmos DB for NoSQL — connect & query using the SDK',
  'Cosmos DB — optimize RU consumption, indexing policies, consistency levels',
  'Cosmos DB — vector embeddings & similarity search for semantic retrieval; change feed processor',
  'Azure Database for PostgreSQL — connect/query via SDK, schema modeling, indexing strategies',
  'PostgreSQL — pgvector optimization, compute/memory/storage config for vector workloads, connection optimization',
  'PostgreSQL — vector similarity search & RAG patterns; Azure Managed Redis — caching/expiration/invalidation + vector indexing',
  'Azure Service Bus — queues, dead-letter handling, messages, topics, subscriptions',
  'Azure Event Grid — event-driven workflows, filters, custom events, retries',
  'Azure Functions — serverless APIs, triggers & bindings',
  'Azure Functions — configure & deploy function apps',
  'Azure Key Vault — secrets, rotation, retrieval; Azure App Configuration',
  'OpenTelemetry SDKs — distributed tracing; KQL queries — analyze logs & metrics',
  'Full revision — review the official study guide checklist, note weak areas',
  'Practice test 1 (AI Skills Navigator) + review mistakes',
  'Practice test 2 + final review — book/attempt the exam',
];

const AZ900 = [
  'Cloud computing concepts — value proposition, economies of scale, CapEx vs OpEx',
  'Cloud types — public/private/hybrid; service models — IaaS/PaaS/SaaS',
  'Core architecture — Regions & Availability Zones',
  'Core architecture — Resource Groups, Subscriptions, Management Groups, ARM',
  'Compute services — VMs, VM Scale Sets, App Services, Containers, Functions',
  'Networking services — VNets, VPN Gateway, ExpressRoute, Load Balancer',
  'Storage services — Blob, File, Disk, Queue storage',
  'Storage redundancy options — LRS, ZRS, GRS, RA-GRS',
  'Identity & access — Azure AD, MFA, Conditional Access, RBAC, Zero Trust',
  'Security tools — Defender for Cloud, Key Vault, NSGs, DDoS Protection',
  'Cost management — pricing calculator, TCO calculator, budgets',
  'Governance — Azure Policy, Blueprints, Resource Locks, Tags',
  'Management & deployment tools — Portal, CLI, PowerShell, ARM templates, Cloud Shell',
  'Monitoring tools — Azure Monitor, Advisor, Service Health',
  'Privacy, compliance & trust — Trust Center, Compliance Manager, GDPR basics, SLA',
  'Full topic revision — review study guide checklist, note weak areas',
  'Practice test 1 (official practice assessment) + review mistakes',
  'Practice test 2 + review weak areas again',
  'Final revision — quick notes/flashcards on weak areas',
  'Light review — book/attempt the exam',
];

const DSA = [
  'What is DSA & why it matters — how to think about problems',
  'Big-O notation: time complexity basics (O(1), O(n), O(n²))',
  'Big-O notation: space complexity + best/worst/average case',
  'C# essentials for DSA: variables, loops, methods, debugging basics',
  'Arrays: what is an array — declaration, indexing, fixed size in C#',
  'Arrays: traversal — for loop vs foreach, reading & printing elements',
  'Arrays: insertion — at end, at a given index (shifting elements)',
  'Arrays: deletion — at end, at a given index (shifting elements)',
  'Arrays: searching — linear search, find min/max',
  'Arrays: aggregation — sum, average, count/frequency of elements',
  'Arrays: reverse an array — two approaches (extra array vs in-place)',
  'Arrays: rotate an array — left & right rotation (brute force + optimal)',
  'Arrays: two-pointer technique — pair with given sum, remove duplicates from sorted array',
  'Arrays: sliding window technique — max sum subarray of size k',
  'Arrays: prefix sum technique — range sum queries, equilibrium index',
  'Arrays: Kadane’s algorithm — maximum subarray sum',
  'Arrays: 2D arrays/matrices — declaration, traversal, row/column sum',
  'Arrays: practice problems (easy) — move zeroes, missing number & more',
  'Arrays: practice problems (medium) — additional set',
  'Strings: basics — immutability in C#, char array vs string, StringBuilder',
  'Strings: traversal & basic operations — length, substring, concatenation',
  'Strings: reverse a string — two approaches',
  'Strings: palindrome check',
  'Strings: anagram check, character frequency (Dictionary)',
  'Strings: two-pointer technique — valid palindrome variants',
  'Strings: sliding window — longest substring without repeating characters',
  'Strings: practice problems (easy) x5',
  'Strings: practice problems (medium) — additional set',
  'Math for DSA: GCD/LCM, prime numbers, factorial',
  'Bit manipulation basics — AND/OR/XOR, check even/odd, count set bits',
  'Recursion: concept, call stack, base case & recursive case',
  'Recursion: factorial, sum of n numbers, power function',
  'Recursion: Fibonacci — recursive vs memoized',
  'Recursion: practice — reverse an array/string recursively',
  'Recursion: backtracking intro — concept & subsets problem',
  'Recursion: backtracking practice — permutations of a string',
  'Recursion: additional practice — more backtracking problems',
  'Searching: Linear Search — concept & implementation',
  'Searching: Binary Search — iterative & recursive implementation',
  'Searching: Binary Search variants — first/last occurrence, search in rotated array',
  'Sorting: Bubble Sort',
  'Sorting: Selection Sort',
  'Sorting: Insertion Sort',
  'Sorting: Merge Sort',
  'Sorting: Quick Sort',
  'Sorting: complexity comparison + practice problems',
  'Sorting: additional practice — sort a list of custom objects',
  'Revision: mixed practice — Arrays, Strings, Recursion, Sorting, Searching',
  'LinkedList: concept, Node class, singly linked list — create & traverse',
  'LinkedList: insertion — at head, at tail, at a given position',
  'LinkedList: deletion — at head, at tail, at a given position',
  'LinkedList: reverse a linked list — iterative & recursive',
  'LinkedList: detect a cycle — Floyd’s algorithm (tortoise & hare)',
  'LinkedList: find middle element, Nth node from end',
  'LinkedList: doubly linked list — concept & basic operations',
  'LinkedList: additional practice — merge two sorted lists, intersection point',
  'Stack: concept & implementation (array-based & using C# Stack<T>)',
  'Stack: balanced parentheses problem',
  'Stack: next greater element problem',
  'Stack: practice problems',
  'Queue: concept & implementation (using C# Queue<T>)',
  'Queue: circular queue',
  'Queue: deque (double-ended queue)',
  'Queue: practice — implement a stack using two queues',
  'Stack & Queue: additional practice problems',
  'Hashing: HashSet/Dictionary in C#, how hashing works, collision handling',
  'Hashing: practice — two-sum, first non-repeating character',
  'Hashing: practice — group anagrams, subarray sum equals k',
  'Revision: mixed practice — LinkedList, Stack, Queue, Hashing',
  'Trees: binary tree concept & terminology, Node class in C#',
  'Trees: traversals — inorder, preorder, postorder (recursive)',
  'Trees: level order traversal (BFS) using a Queue',
  'Trees: height, diameter, count nodes',
  'Binary Search Tree: concept & insertion',
  'Binary Search Tree: search & deletion',
  'Binary Search Tree: validate a BST, find min/max',
  'Trees: practice — lowest common ancestor, mirror a tree',
  'Trees: additional practice — diameter, path sum problems',
  'Heaps: concept — min-heap/max-heap, array representation',
  'Heaps: priority queue in C# (PriorityQueue<T,P>)',
  'Heaps: practice — kth largest element, top k frequent elements',
  'Revision: mixed practice — Trees, Heaps',
  'Graphs: concept & representation — adjacency list/matrix',
  'Graphs: BFS traversal',
  'Graphs: DFS traversal',
  'Graphs: practice — number of connected components / islands',
  'Graphs: shortest path intro — Dijkstra’s algorithm overview',
  'Graphs: practice problems',
  'Graphs: additional practice — cycle detection, topological sort intro',
  'Dynamic Programming: concept — memoization vs tabulation',
  'DP: Fibonacci with DP, climbing stairs',
  'DP: 0/1 knapsack problem',
  'DP: longest common subsequence',
  'DP: practice problems',
  'DP: additional practice — coin change, longest increasing subsequence',
  'Greedy algorithms: concept & examples (activity selection, coin change)',
  'Greedy: practice problems',
  'Full mixed revision — one problem from every topic covered',
  'Additional mixed revision — a second problem from every topic covered',
  'Mock interview practice — timed problem solving',
];

const DOTNET = [
  'Create ASP.NET Core Web API project, folder structure setup',
  'Configure Swagger, appsettings, DI basics',
  'Add User model + DbContext skeleton (EF Core intro)',
  'Implement JWT token generation (login endpoint)',
  'Implement JWT validation middleware + [Authorize]',
  'Add role-based authorization + test with Postman',
  'EF Core — DbContext, Migrations basics',
  'EF Core — Relationships (1:1, 1:N, N:N)',
  'EF Core — Fluent API & configurations',
  'EF Core — query performance (Include, AsNoTracking, projections)',
  'EF Core — transactions & concurrency handling',
  'EF Core — practice: build full CRUD with relationships',
  'EF Core — additional practice: complex queries with Include & split queries',
  'Repository Pattern — implement for your API',
  'Unit of Work Pattern',
  'Factory Pattern',
  'Singleton & DI lifetimes (Transient/Scoped/Singleton)',
  'CQRS Pattern — concept & simple implementation',
  'Strategy & Decorator Patterns — apply to the API',
  'Design Patterns — additional practice: apply Observer or Adapter pattern',
  'Clean Architecture — layers overview (Domain/Application/Infra/API)',
  'Restructure project into Clean Architecture layers',
  'Move business logic into Application layer (Services/UseCases)',
  'MediatR — introduce for CQRS + Clean Architecture',
  'Clean Architecture — review & refactor full project',
  'Clean Architecture — additional practice: add a new feature end-to-end through all layers',
  'Redis basics — install, StackExchange.Redis setup',
  'Implement caching for GET endpoints',
  'Cache invalidation strategies',
  'Distributed caching concepts',
  'Redis — practice: cache a heavy query end-to-end',
  'Redis — additional practice: cache invalidation on a write-heavy endpoint',
  'Serilog setup — structured logging',
  'Application Insights integration',
  'Correlation IDs & request logging middleware',
  'Logging — practice: add logging across the API',
  'Docker course — containers & images fundamentals',
  'Docker course — Dockerfile basics, build & run',
  'Docker course — Docker Compose',
  'Dockerize your Web API project',
  'Docker — volumes, networks, environment configs',
  'Docker — practice: full app + DB in Docker Compose',
  'Docker — additional practice: multi-stage build to shrink image size',
  'SignalR basics — Hubs & Clients',
  'Implement a real-time notification Hub in your API',
  'SignalR groups & connection management',
  'SignalR — client integration (JS/Angular)',
  'SignalR — practice: real-time feature end-to-end',
  'SignalR — additional practice: scale-out considerations (backplane concept)',
  'xUnit basics — writing your first tests',
  'Moq — mocking dependencies',
  'Unit testing — Services & Repositories layer',
  'Unit testing — Controllers layer',
  'Unit testing — practice: cover core API logic',
  'Unit testing — additional practice: integration tests with WebApplicationFactory',
  'Elasticsearch basics — concepts, indexing',
  'Elasticsearch — .NET client setup',
  'Implement a search endpoint using Elasticsearch',
  'Elasticsearch — filters, aggregations',
  'Elasticsearch — practice: full-text search feature',
  'Rate Limiting middleware in ASP.NET Core',
  'Health Checks — add to API + DB checks',
  'Practice: apply rate limiting + health checks',
  'Kubernetes course — pods, nodes, clusters fundamentals',
  'Kubernetes course — deployments & services',
  'Kubernetes course — ConfigMaps & Secrets',
  'Kubernetes — deploy your dockerized API to Minikube',
  'Kubernetes — scaling & rolling updates',
  'Kubernetes — Ingress basics',
  'Kubernetes — practice: full deployment end-to-end',
  'Kubernetes — additional practice: resource limits & readiness/liveness probes',
  'RabbitMQ basics — exchanges, queues, bindings',
  'RabbitMQ — producer implementation in .NET',
  'RabbitMQ — consumer implementation in .NET',
  'RabbitMQ — message patterns (pub/sub, work queues)',
  'RabbitMQ — error handling & dead-letter queues',
  'RabbitMQ — practice: order-processing flow end-to-end',
  'RabbitMQ — additional practice: a second queue with different routing rules',
  'API Gateway concept — why microservices need one',
  'YARP — setup reverse proxy basics',
  'YARP — routing to multiple services',
  'API Gateway — practice: gateway in front of 2 services',
  'gRPC basics — protobuf & service definitions',
  'gRPC — implement a service in .NET',
  'gRPC — client-server communication test',
  'gRPC — practice: use for inter-service calls',
  'Microservices — design 2-3 services for your project (plan)',
  'Microservices — scaffold Service A (e.g. Orders)',
  'Microservices — scaffold Service B (e.g. Inventory)',
  'Microservices — connect services via RabbitMQ',
  'Microservices — add API Gateway in front of both services',
  'Microservices — add gRPC for one sync call between services',
  'Microservices — Dockerize all services + Compose',
  'Microservices — practice: full flow test end-to-end',
  'Microservices — additional practice: add a third small service and wire it in',
  'Azure DevOps — create org/project, Git repos & branching strategy; push Web API + Microservices projects',
  'Azure DevOps Pipelines — CI/CD YAML pipeline for the Web API project (build, test, deploy)',
  'Azure DevOps — CI/CD pipeline for the Microservices project; Boards — plan & track work items',
  'Polish both projects — README, clean code pass; update resume with new skills & projects',
  'Final revision — review weak topics across DSA/.NET/Azure',
];

const SQL_CORE = [
  'SELECT, WHERE, ORDER BY revision',
  'JOINS — INNER / LEFT / RIGHT / FULL',
  'GROUP BY, HAVING, aggregate functions',
  'Subqueries',
  'Window functions — ROW_NUMBER, RANK',
  'Window functions — LEAD/LAG, PARTITION BY',
  'Indexes & query performance basics',
  'Normalization (1NF–3NF)',
  'Stored Procedures & Functions',
  'Transactions & ACID properties',
  'Views & CTEs',
  'Query optimization / execution plans',
];

// Days 1-90: Agentic AI Engineering — building LLM apps, agents, RAG and
// (as a major focus) custom MCP servers, integrated across the same 90 days.
// No AI theory/prompt-engineering-basics content — this assumes you already
// know how to use ChatGPT/Claude and goes straight to building.
const AGENTIC = [
  // LLM Application Development (d1-8)
  'LLM APIs — provider landscape (OpenAI, Azure OpenAI, Anthropic), auth & request basics',
  'Model APIs — chat completions, key parameters (temperature, max tokens, system prompts)',
  'Streaming responses — SSE streaming, handling partial tokens in your app',
  'Structured outputs — JSON mode / schema-constrained responses',
  'Function/tool calling basics — how LLMs request tool calls, response format',
  'Embeddings — what they are, generating embeddings via API',
  'Context management & token management — context windows, truncation, cost/token counting',
  'Build: a minimal LLM-powered console app in .NET calling Azure OpenAI end-to-end',
  'Build: extend it with streaming output + a second provider (OpenAI or Anthropic) for comparison',
  // Tool Calling
  'Tool/function calling concept — why LLMs need external tools',
  'Tool schemas — defining name/description/parameters (JSON schema)',
  'Passing arguments & executing tools — parsing LLM tool-call requests, invoking real functions',
  'Returning tool results to the LLM; the multi-turn tool loop',
  'Multiple tools, tool selection, tool validation & error handling',
  'Build: a .NET app where an LLM calls 2-3 real tools (weather/calculator/DB lookup)',
  'Build: add a 4th tool and handle a tool failure gracefully (retry/fallback)',
  // AI Agents
  'What is an AI Agent — Agent vs a plain LLM call',
  'The agent loop — perceive / plan / act / observe',
  'Tool-using agents — wiring tool calling into an autonomous loop',
  'Planning & task decomposition — breaking a goal into steps',
  'Agent state — tracking progress across steps',
  'Short-term memory within a run — conversation/task memory',
  'Multi-step workflows — chaining tool calls toward a goal',
  'Human approval steps & guardrails — pausing for confirmation, validating outputs',
  'Build: a working agent (.NET/Python) that autonomously completes a 3-4 step task using tools',
  'Build: extend your agent with a new tool and a second human-approval checkpoint',
  // RAG
  'RAG concept — why retrieval augments LLM knowledge',
  'Documents & chunking strategies — splitting text for retrieval',
  'Embeddings for retrieval — embedding chunks, storing vectors',
  'Vector databases — Azure AI Search vector store / pgvector overview',
  'Vector search & retrieval — similarity search, top-k retrieval, metadata filtering',
  'Hybrid search & building context — keyword+vector search, prompt assembly with citations',
  'Build: a working document Q&A/RAG app (ingest → embed → store → query → cited answer)',
  'Build: add hybrid search + a re-ranking step to improve answer quality',
  // MCP fundamentals
  'MCP fundamentals — what problem MCP solves, why it matters for agents',
  'MCP architecture — Host / Client / Server relationship',
  'MCP Host & MCP Client — responsibilities and communication',
  'MCP Server — exposing capabilities to clients',
  'MCP Tools — how servers expose callable tools',
  'MCP Resources & MCP Prompts — exposing data and prompt templates via MCP',
  'Tool discovery & the MCP communication protocol',
  'MCP transports — stdio vs HTTP/SSE, and when each is used',
  // Build Custom MCP Server
  'Set up a basic MCP server (SDK hello-world server)',
  'Add a custom tool to your MCP server',
  'Add multiple tools — organizing tool definitions',
  'Define tool schemas & input validation',
  'Error handling in MCP tools — returning proper error responses',
  'Logging in an MCP server',
  'Integrate an external API call inside an MCP tool',
  'Integrate a database inside an MCP tool (read/write via a tool)',
  'MCP server security basics — auth, input sanitization, least privilege',
  'Test and deploy your custom MCP server (local + basic deployment)',
  'Build: add one more real-world tool to your MCP server (your choice) end-to-end',
  // MCP + .NET, incl. Agent+MCP integration
  'MCP with C# — .NET MCP SDK overview',
  'Building an MCP server with ASP.NET Core — project setup',
  'Custom .NET MCP server — first working tool in C#',
  'Dependency Injection in your MCP server tools',
  'SQL Server integration — an MCP tool that queries SQL Server safely',
  'REST API integration — an MCP tool that calls an internal/external REST API',
  'Authentication/Authorization for your .NET MCP server',
  'Logging, error handling & testing your .NET MCP server end-to-end',
  'Design the Agent → MCP Client → Custom MCP Server → Tools pipeline',
  'Wire an agent to an MCP client that connects to your custom .NET MCP server',
  'Agent tool discovery via MCP — enumerate & use server-exposed tools dynamically',
  'Connect SQL + REST API tools from your MCP server into the agent’s toolset',
  'Connect a Files tool (read/write local files) via MCP into the agent',
  'Build: agent completes a real multi-step task end-to-end using only MCP-discovered tools',
  'Build: add a 4th MCP-exposed tool and a second multi-step scenario for your agent',
  // Agent Memory
  'Conversation state vs short-term memory — what an agent needs mid-task',
  'Persistent memory — storing memory across sessions (file/DB-backed)',
  'Context management with memory — what to keep vs summarize/drop',
  'Memory storage & retrieval patterns (key-value, vector-based memory)',
  'Build: an agent with persistent memory that recalls facts across separate runs',
  'Build: add memory pruning/summarization so old context doesn’t blow the token budget',
  // Multi-Agent Systems
  'Single agent vs multi-agent systems — when multiple agents make sense',
  'Agent roles & responsibilities — specializing agents for sub-tasks',
  'Orchestration & delegation — a coordinator agent assigning work',
  'Inter-agent communication & shared state',
  'Build: a simple 2-3 agent workflow (researcher + writer + reviewer)',
  'Build: add a 4th specialist agent to your workflow and observe delegation in action',
  // AI Security (d72-76)
  'Authentication for AI applications/agents',
  'Authorization — scoping what an agent/tool is allowed to do',
  'Prompt injection — what it is, how to defend against it',
  'Tool security — sandboxing, permission scoping for agent tools',
  'Secrets management for AI apps (API keys, connection strings via Key Vault)',
  // AI Observability (d77-79)
  'Logging agent/tool decisions — structured logs for multi-step runs',
  'Tracing across agent → MCP → tool calls',
  'Monitoring AI systems in production',
  // Production AI (d80-84)
  'Rate limiting LLM API usage',
  'Cost management for LLM/agent workloads',
  'Evaluation — testing/evaluating agent & RAG output quality',
  'Guardrails in production — content filtering, output validation',
  'Human-in-the-loop patterns for production agents',
  'Build: add a cost/usage dashboard and a hard rate-limit to one of your agents',
  // AI Capstone Project
  'Capstone planning — design the “AI Developer Assistant” (Angular + ASP.NET Core + Agent + MCP Client + Custom .NET MCP Server + SQL Server + REST APIs + RAG + Azure)',
  'Capstone — build the custom .NET MCP Server exposing SQL/REST/file/log tools',
  'Capstone — build the Agent + MCP Client integration with multi-step task handling',
  'Capstone — add RAG for documentation search + Angular front-end wiring',
  'Capstone — add human-approval step for sensitive operations + deploy to Azure',
  'Capstone — final polish, end-to-end test, demo walkthrough',
];

function pythonTopic(day) {
  if (day <= 22) return `Udemy Python Course — Section ${day}`;
  if (day === 23) return 'Python course — full revision & wrap-up';
  return `Python Practice — Problem Set ${day - 23}`;
}

function sqlTopic(day) {
  if (day <= SQL_CORE.length) return SQL_CORE[day - 1];
  return `SQL Practice — Problem Set ${day - SQL_CORE.length}`;
}

// ---------------------------------------------------------------------------
// category/topic metadata — one lookup table per subject, mapping a day
// range to a stable topicId/topicName. This is what turns the flat 90-day
// list into the hierarchical Topic Library, with zero duplicated content.
// ---------------------------------------------------------------------------

function rangeLookup(ranges) {
  // ranges: [[fromDay, toDay, topicId, topicName], ...]
  return (day) => ranges.find((r) => day >= r[0] && day <= r[1]);
}

const dsaTopicFor = rangeLookup([
  [1, 4, 'foundations', 'Foundations'],
  [5, 19, 'arrays', 'Arrays'],
  [20, 28, 'strings', 'Strings'],
  [29, 30, 'math-bit', 'Math & Bit Manipulation'],
  [31, 37, 'recursion', 'Recursion & Backtracking'],
  [38, 40, 'searching', 'Searching'],
  [41, 47, 'sorting', 'Sorting'],
  [48, 48, 'revision', 'Revision & Mock Interviews'],
  [49, 56, 'linkedlist', 'Linked List'],
  [57, 60, 'stack', 'Stack'],
  [61, 65, 'queue', 'Queue'],
  [66, 68, 'hashing', 'Hashing'],
  [69, 69, 'revision', 'Revision & Mock Interviews'],
  [70, 78, 'trees', 'Trees & Binary Search Trees'],
  [79, 81, 'heaps', 'Heaps'],
  [82, 82, 'revision', 'Revision & Mock Interviews'],
  [83, 89, 'graphs', 'Graphs'],
  [90, 95, 'dp', 'Dynamic Programming'],
  [96, 97, 'greedy', 'Greedy Algorithms'],
  [98, 100, 'revision', 'Revision & Mock Interviews'],
]);

const dotnetTopicFor = rangeLookup([
  [1, 6, 'auth', 'Authentication & Authorization (JWT)'],
  [7, 13, 'efcore', 'Advanced EF Core'],
  [14, 20, 'design-patterns', 'Design Patterns'],
  [21, 26, 'clean-arch', 'Clean Architecture'],
  [27, 32, 'redis', 'Redis Cache'],
  [33, 36, 'logging', 'Logging & Monitoring'],
  // 37-43 -> Docker (own category, see below)
  [44, 49, 'signalr', 'SignalR'],
  [50, 55, 'unit-testing', 'Unit Testing'],
  [56, 60, 'elasticsearch', 'Elasticsearch'],
  [61, 63, 'rate-limiting', 'Rate Limiting & Health Checks'],
  // 64-71 -> Kubernetes (own category, see below)
  [72, 78, 'rabbitmq', 'RabbitMQ'],
  [79, 82, 'api-gateway', 'API Gateway'],
  [83, 86, 'grpc', 'gRPC'],
  [87, 95, 'microservices', 'Microservices Project'],
  // 96-98 -> DevOps (own category, see below)
  [99, 100, 'career-prep', 'Project Polish & Career Prep'],
]);

const DOCKER_DAYS = [37, 43];
const KUBERNETES_DAYS = [64, 71];
const DEVOPS_DAYS = [96, 98];

const agenticTopicFor = rangeLookup([
  [1, 9, 'llm-apps', 'LLM Applications'],
  [10, 16, 'tool-calling', 'Tool Calling'],
  [17, 26, 'agents', 'AI Agents'],
  [27, 34, 'rag', 'RAG'],
  [35, 42, 'mcp', 'MCP'],
  [43, 53, 'mcp-servers', 'MCP Servers'],
  [54, 68, 'mcp-dotnet', 'MCP + .NET'],
  [69, 74, 'agent-memory', 'Agent Memory'],
  [75, 80, 'multi-agent', 'Multi-Agent Systems'],
  [81, 85, 'ai-security', 'AI Security'],
  [86, 88, 'ai-observability', 'AI Observability'],
  [89, 94, 'production-ai', 'Production AI'],
  [95, 100, 'capstone', 'AI Capstone Project'],
]);

const azureTopicFor = rangeLookup([
  [1, 20, 'ai200', 'AI-200: Azure AI Cloud Developer Associate'],
  [21, 40, 'az900', 'AZ-900: Azure Fundamentals'],
]);

function pythonTopicMeta(day) {
  return day <= 23
    ? { id: 'udemy-course', name: 'Udemy Python Course' }
    : { id: 'practice', name: 'Practice Problems' };
}

function sqlTopicMeta(day) {
  return day <= SQL_CORE.length
    ? { id: 'core', name: 'Core SQL' }
    : { id: 'practice', name: 'Practice Problems' };
}

// ---------------------------------------------------------------------------
// Category metadata (id, name, color token used by the UI)
// ---------------------------------------------------------------------------

const CATEGORIES = {
  azure: { name: 'Azure Certifications', color: 'azure' },
  python: { name: 'Python', color: 'python' },
  dotnet: { name: '.NET', color: 'net' },
  dsa: { name: 'DSA', color: 'dsa' },
  sql: { name: 'SQL', color: 'sql' },
  docker: { name: 'Docker', color: 'docker' },
  kubernetes: { name: 'Kubernetes', color: 'kubernetes' },
  devops: { name: 'DevOps / Azure DevOps', color: 'devops' },
  agentic: { name: 'Agentic AI & MCP', color: 'agentic' },
};

// Light prerequisite hints, topic-level only (id refs are `${categoryId}/${topicId}`).
// Kept intentionally sparse — only the genuinely load-bearing ones.
const PREREQUISITES = {
  'dsa/arrays': ['dsa/foundations'],
  'dsa/strings': ['dsa/arrays'],
  'dsa/recursion': ['dsa/arrays', 'dsa/strings'],
  'dsa/linkedlist': ['dsa/recursion'],
  'dsa/trees': ['dsa/linkedlist', 'dsa/recursion'],
  'dsa/graphs': ['dsa/trees'],
  'dsa/dp': ['dsa/recursion'],
  'dotnet/efcore': ['dotnet/auth'],
  'dotnet/clean-arch': ['dotnet/design-patterns'],
  'dotnet/microservices': ['dotnet/rabbitmq', 'dotnet/api-gateway', 'dotnet/grpc'],
  'kubernetes/k8s-basics': ['docker/docker-basics'],
  'devops/cicd': ['docker/docker-basics'],
  'agentic/tool-calling': ['agentic/llm-apps'],
  'agentic/agents': ['agentic/tool-calling'],
  'agentic/rag': ['agentic/llm-apps'],
  'agentic/mcp': ['agentic/tool-calling'],
  'agentic/mcp-servers': ['agentic/mcp'],
  'agentic/mcp-dotnet': ['agentic/mcp-servers', 'dotnet/auth'],
  'agentic/agent-memory': ['agentic/agents'],
  'agentic/multi-agent': ['agentic/agent-memory'],
  'agentic/ai-security': ['agentic/mcp-dotnet'],
  'agentic/ai-observability': ['agentic/mcp-dotnet'],
  'agentic/production-ai': ['agentic/ai-security', 'agentic/ai-observability'],
  'agentic/capstone': ['agentic/production-ai', 'agentic/rag', 'agentic/multi-agent'],
};

// A short, generic set of interview questions + one root doc link per topic.
// Kept concise on purpose — this is a revision aid, not a textbook.
const TOPIC_EXTRAS = {
  'dsa/arrays': {
    questions: [
      'How do you reverse an array in-place without extra memory?',
      'Explain the two-pointer technique with an example.',
      'What is Kadane’s algorithm and when would you use it?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/csharp/'],
  },
  'dsa/linkedlist': {
    questions: [
      'How do you detect a cycle in a linked list?',
      'How do you reverse a linked list iteratively and recursively?',
      'Array vs linked list — when would you pick one over the other?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/csharp/'],
  },
  'dsa/trees': {
    questions: [
      'Explain the difference between BFS and DFS traversal on a tree.',
      'How do you validate whether a binary tree is a valid BST?',
      'How do you find the lowest common ancestor of two nodes?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/csharp/'],
  },
  'dsa/graphs': {
    questions: [
      'When would you use BFS vs DFS on a graph?',
      'How does Dijkstra’s algorithm find the shortest path?',
      'How do you detect connected components in a graph?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/csharp/'],
  },
  'dsa/dp': {
    questions: [
      'What is the difference between memoization and tabulation?',
      'How do you identify that a problem needs dynamic programming?',
      'Walk through solving 0/1 knapsack with DP.',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/csharp/'],
  },
  'dotnet/auth': {
    questions: [
      'How does JWT authentication work end-to-end in ASP.NET Core?',
      'What is the difference between authentication and authorization?',
      'How would you implement role-based vs claims-based authorization?',
    ],
    resources: ['https://learn.microsoft.com/en-us/aspnet/core/security/'],
  },
  'dotnet/efcore': {
    questions: [
      'What is the difference between eager, lazy, and explicit loading in EF Core?',
      'How do you optimize a slow EF Core query?',
      'How does EF Core handle concurrency conflicts?',
    ],
    resources: ['https://learn.microsoft.com/en-us/ef/core/'],
  },
  'dotnet/design-patterns': {
    questions: [
      'What problem does the Repository pattern solve, and what are its trade-offs?',
      'Explain the Singleton pattern and how DI lifetimes relate to it.',
      'When would you choose CQRS over a simple CRUD service?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/architecture/'],
  },
  'dotnet/clean-arch': {
    questions: [
      'What are the layers in Clean Architecture and what belongs in each?',
      'Why should the Domain layer have no external dependencies?',
      'How does MediatR help implement Clean Architecture?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/architecture/'],
  },
  'dotnet/redis': {
    questions: [
      'How do you decide what to cache and for how long?',
      'How do you handle cache invalidation on data updates?',
      'What is the difference between in-memory caching and distributed caching?',
    ],
    resources: ['https://redis.io/docs/latest/'],
  },
  'dotnet/logging': {
    questions: [
      'Why use structured logging instead of plain text logs?',
      'What is a correlation ID and why does it matter in distributed systems?',
      'How would you trace a request across multiple services?',
    ],
    resources: ['https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/'],
  },
  'dotnet/signalr': {
    questions: [
      'How does SignalR choose a transport (WebSockets, SSE, long polling)?',
      'How do SignalR groups work and when would you use them?',
      'How would you scale SignalR across multiple server instances?',
    ],
    resources: ['https://learn.microsoft.com/en-us/aspnet/core/signalr/'],
  },
  'dotnet/unit-testing': {
    questions: [
      'What is the difference between a mock, a stub, and a fake?',
      'How do you unit test a class that depends on EF Core’s DbContext?',
      'What makes a unit test brittle, and how do you avoid that?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/core/testing/'],
  },
  'dotnet/elasticsearch': {
    questions: [
      'How is Elasticsearch different from a relational database for search?',
      'What is an inverted index and why does it make search fast?',
      'How do filters differ from queries in Elasticsearch?',
    ],
    resources: ['https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html'],
  },
  'dotnet/rate-limiting': {
    questions: [
      'What rate limiting algorithms does ASP.NET Core support?',
      'What should a health check endpoint actually verify?',
      'How do health checks feed into Kubernetes readiness/liveness probes?',
    ],
    resources: ['https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit'],
  },
  'dotnet/rabbitmq': {
    questions: [
      'What is the difference between a queue, an exchange, and a routing key?',
      'How do dead-letter queues help with failed message processing?',
      'Pub/sub vs work queue pattern — when do you use each?',
    ],
    resources: ['https://www.rabbitmq.com/tutorials'],
  },
  'dotnet/api-gateway': {
    questions: [
      'What problems does an API Gateway solve in a microservices system?',
      'How does YARP route requests to backend services?',
      'What cross-cutting concerns belong at the gateway vs the service?',
    ],
    resources: ['https://microsoft.github.io/reverse-proxy/'],
  },
  'dotnet/grpc': {
    questions: [
      'How is gRPC different from a REST API?',
      'What is Protocol Buffers and why is it efficient?',
      'When would you choose gRPC over REST for inter-service calls?',
    ],
    resources: ['https://learn.microsoft.com/en-us/aspnet/core/grpc/'],
  },
  'dotnet/microservices': {
    questions: [
      'How do microservices communicate — sync vs async — and when do you pick each?',
      'How do you handle data consistency across services without a shared database?',
      'What is the difference between orchestration and choreography?',
    ],
    resources: ['https://learn.microsoft.com/en-us/dotnet/architecture/microservices/'],
  },
  'azure/ai200': {
    questions: [
      'How would you design a serverless AI inference endpoint on Azure?',
      'When would you use Cosmos DB vector search vs a dedicated vector database?',
      'How do you secure secrets used by an Azure Function calling an AI model?',
    ],
    resources: ['https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200'],
  },
  'azure/az900': {
    questions: [
      'What is the difference between IaaS, PaaS, and SaaS?',
      'Explain the difference between availability zones and regions.',
      'What is the shared responsibility model in the cloud?',
    ],
    resources: ['https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900'],
  },
  'docker/docker-basics': {
    questions: [
      'What is the difference between a container and a virtual machine?',
      'What does each instruction in a Dockerfile actually do (FROM, RUN, COPY, CMD)?',
      'How does Docker Compose help with multi-container apps?',
    ],
    resources: ['https://docs.docker.com/get-started/'],
  },
  'kubernetes/k8s-basics': {
    questions: [
      'What is the difference between a Pod, a Deployment, and a Service?',
      'How does Kubernetes handle scaling and self-healing?',
      'What is the difference between a ConfigMap and a Secret?',
    ],
    resources: ['https://kubernetes.io/docs/home/'],
  },
  'devops/cicd': {
    questions: [
      'What is the difference between continuous integration and continuous deployment?',
      'What would a YAML pipeline for a .NET Web API typically contain?',
      'How do Azure Boards work items connect to commits and pull requests?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/devops/'],
  },
  'python/udemy-course': {
    questions: [
      'What is the difference between a list and a tuple in Python?',
      'How does Python handle function arguments — by value or by reference?',
      'What are Python decorators and when would you use one?',
    ],
    resources: ['https://docs.python.org/3/tutorial/'],
  },
  'sql/core': {
    questions: [
      'What is the difference between INNER JOIN and LEFT JOIN?',
      'How do window functions differ from GROUP BY aggregates?',
      'How would you use an execution plan to debug a slow query?',
    ],
    resources: ['https://learn.microsoft.com/en-us/sql/t-sql/'],
  },
  'agentic/llm-apps': {
    questions: [
      'How does streaming a response differ from a regular request/response call?',
      'What is a context window and why does it constrain your application design?',
      'How would you constrain an LLM to return valid JSON every time?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/ai-services/openai/'],
  },
  'agentic/tool-calling': {
    questions: [
      'Walk through the full request/response cycle of a tool call.',
      'How do you validate arguments an LLM passes to a tool before executing it?',
      'What happens if a tool call fails — how should the app recover?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/function-calling'],
  },
  'agentic/agents': {
    questions: [
      'What actually distinguishes an "agent" from a single LLM call with tools?',
      'How does an agent decide when a task is complete?',
      'Why do agents need guardrails and human approval steps in production?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/ai-services/openai/'],
  },
  'agentic/rag': {
    questions: [
      'How do you choose a chunking strategy for a given document type?',
      'What is the difference between keyword search, vector search, and hybrid search?',
      'How do you keep a RAG answer grounded and cite its sources?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/search/vector-search-overview'],
  },
  'agentic/mcp': {
    questions: [
      'What problem does MCP solve that ad-hoc tool calling doesn’t?',
      'Explain the relationship between an MCP Host, Client, and Server.',
      'What is the difference between an MCP Tool, an MCP Resource, and an MCP Prompt?',
    ],
    resources: ['https://modelcontextprotocol.io/'],
  },
  'agentic/mcp-servers': {
    questions: [
      'What does a minimal MCP server need to expose to be usable by a client?',
      'How do you validate tool input in an MCP server?',
      'What security concerns are specific to an MCP server exposing real systems?',
    ],
    resources: ['https://modelcontextprotocol.io/'],
  },
  'agentic/mcp-dotnet': {
    questions: [
      'How would you structure DI in an ASP.NET Core MCP server?',
      'How do you safely expose a SQL Server query as an MCP tool?',
      'How does an agent discover and call tools exposed by your custom MCP server?',
    ],
    resources: ['https://modelcontextprotocol.io/', 'https://learn.microsoft.com/en-us/aspnet/core/'],
  },
  'agentic/agent-memory': {
    questions: [
      'What is the difference between short-term and persistent memory for an agent?',
      'How do you decide what to summarize vs. discard from memory?',
      'What storage would you pick for agent memory, and why?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/ai-services/openai/'],
  },
  'agentic/multi-agent': {
    questions: [
      'When does a task justify multiple agents instead of one?',
      'How does a coordinator agent delegate work to sub-agents?',
      'How do agents share state without stepping on each other?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/ai-services/openai/'],
  },
  'agentic/ai-security': {
    questions: [
      'What is a prompt injection attack and how do you defend against one?',
      'How do you scope what a tool/agent is allowed to do (least privilege)?',
      'Where should secrets used by an agent live, and how are they accessed safely?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/key-vault/general/overview'],
  },
  'agentic/ai-observability': {
    questions: [
      'What should a trace capture across an agent → MCP → tool call chain?',
      'How is logging an agent’s decisions different from logging a normal API request?',
      'What would you monitor to catch a misbehaving agent in production?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/azure-monitor/'],
  },
  'agentic/production-ai': {
    questions: [
      'How do you evaluate whether an agent or RAG pipeline is actually working well?',
      'What does a human-in-the-loop checkpoint look like for a risky action?',
      'How would you control and monitor the cost of an agent that can call tools in a loop?',
    ],
    resources: ['https://learn.microsoft.com/en-us/azure/ai-services/openai/'],
  },
  'agentic/capstone': {
    questions: [
      'Walk through your "AI Developer Assistant" architecture end-to-end.',
      'Where did you add a human-approval step, and why there specifically?',
      'What would you change to make this capstone production-ready?',
    ],
    resources: ['https://modelcontextprotocol.io/'],
  },
};

// ---------------------------------------------------------------------------
// Build the flat item list
// ---------------------------------------------------------------------------

const items = [];
let order = 0;

function addItem({ day, categoryId, topicId, topicName, title, minutes }) {
  order += 1;
  items.push({
    id: `${categoryId}-${topicId}-d${day}`,
    day,
    week: Math.ceil(day / 6),
    categoryId,
    categoryName: CATEGORIES[categoryId].name,
    topicId,
    topicName,
    title,
    minutes,
    order,
  });
}

for (let day = 1; day <= 100; day++) {
  // --- Certifications (days 1-40 only) ---
  const az = azureTopicFor(day);
  if (az) {
    const topic = az[2] === 'ai200' ? AI200[day - 1] : AZ900[day - 21];
    addItem({
      day,
      categoryId: 'azure',
      topicId: az[2],
      topicName: az[3],
      title: topic,
      minutes: az[2] === 'ai200' ? 180 : 100,
    });
  }

  // --- DSA (all 90 days) ---
  const dsaT = dsaTopicFor(day);
  addItem({
    day,
    categoryId: 'dsa',
    topicId: dsaT[2],
    topicName: dsaT[3],
    title: DSA[day - 1],
    minutes: 100,
  });

  // --- Python (all 90 days) ---
  const pyMeta = pythonTopicMeta(day);
  addItem({
    day,
    categoryId: 'python',
    topicId: pyMeta.id,
    topicName: pyMeta.name,
    title: pythonTopic(day),
    minutes: 60,
  });

  // --- SQL (all 90 days) ---
  const sqlMeta = sqlTopicMeta(day);
  addItem({
    day,
    categoryId: 'sql',
    topicId: sqlMeta.id,
    topicName: sqlMeta.name,
    title: sqlTopic(day),
    minutes: 25,
  });

  // --- .NET / Docker / Kubernetes / DevOps (all 90 days, one array, re-tagged by day range) ---
  const title = DOTNET[day - 1];
  if (day >= DOCKER_DAYS[0] && day <= DOCKER_DAYS[1]) {
    addItem({ day, categoryId: 'docker', topicId: 'docker-basics', topicName: 'Docker Fundamentals', title, minutes: 90 });
  } else if (day >= KUBERNETES_DAYS[0] && day <= KUBERNETES_DAYS[1]) {
    addItem({ day, categoryId: 'kubernetes', topicId: 'k8s-basics', topicName: 'Kubernetes Fundamentals', title, minutes: 90 });
  } else if (day >= DEVOPS_DAYS[0] && day <= DEVOPS_DAYS[1]) {
    addItem({ day, categoryId: 'devops', topicId: 'cicd', topicName: 'CI/CD with Azure DevOps', title, minutes: 90 });
  } else {
    const dn = dotnetTopicFor(day);
    addItem({ day, categoryId: 'dotnet', topicId: dn[2], topicName: dn[3], title, minutes: 90 });
  }

  // --- Agentic AI Engineering (all 90 days) ---
  const ag = agenticTopicFor(day);
  addItem({ day, categoryId: 'agentic', topicId: ag[2], topicName: ag[3], title: AGENTIC[day - 1], minutes: 60 });
}

const output = {
  categories: CATEGORIES,
  prerequisites: PREREQUISITES,
  topicExtras: TOPIC_EXTRAS,
  items,
};

const outDir = join(__dirname, '..', 'src', 'assets');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'learning-data.json');
writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
console.log('Wrote', outPath, '-', items.length, 'items');
