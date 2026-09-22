// One-off generator: writes the full 90-day roadmap into src/assets/roadmap-data.json.
// Run with: node scripts/generate-roadmap.mjs
// Re-run this after editing the topic lists below, then rebuild the app.

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Days 1-20: AI-200 (Azure AI Cloud Developer Associate), ~3 hrs/day.
// Based on the official "Skills measured" outline for Exam AI-200.
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

// Days 21-40: AZ-900 (Azure Fundamentals), ~1.5-2 hrs/day.
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
  'Strings: basics — immutability in C#, char array vs string, StringBuilder',
  'Strings: traversal & basic operations — length, substring, concatenation',
  'Strings: reverse a string — two approaches',
  'Strings: palindrome check',
  'Strings: anagram check, character frequency (Dictionary)',
  'Strings: two-pointer technique — valid palindrome variants',
  'Strings: sliding window — longest substring without repeating characters',
  'Strings: practice problems (easy) x5',
  'Math for DSA: GCD/LCM, prime numbers, factorial',
  'Bit manipulation basics — AND/OR/XOR, check even/odd, count set bits',
  'Recursion: concept, call stack, base case & recursive case',
  'Recursion: factorial, sum of n numbers, power function',
  'Recursion: Fibonacci — recursive vs memoized',
  'Recursion: practice — reverse an array/string recursively',
  'Recursion: backtracking intro — concept & subsets problem',
  'Recursion: backtracking practice — permutations of a string',
  'Searching: Linear Search — concept & implementation',
  'Searching: Binary Search — iterative & recursive implementation',
  'Searching: Binary Search variants — first/last occurrence, search in rotated array',
  'Sorting: Bubble Sort',
  'Sorting: Selection Sort',
  'Sorting: Insertion Sort',
  'Sorting: Merge Sort',
  'Sorting: Quick Sort',
  'Sorting: complexity comparison + practice problems',
  'Revision: mixed practice — Arrays, Strings, Recursion, Sorting, Searching',
  'LinkedList: concept, Node class, singly linked list — create & traverse',
  'LinkedList: insertion — at head, at tail, at a given position',
  'LinkedList: deletion — at head, at tail, at a given position',
  'LinkedList: reverse a linked list — iterative & recursive',
  'LinkedList: detect a cycle — Floyd’s algorithm (tortoise & hare)',
  'LinkedList: find middle element, Nth node from end',
  'LinkedList: doubly linked list — concept & basic operations',
  'Stack: concept & implementation (array-based & using C# Stack<T>)',
  'Stack: balanced parentheses problem',
  'Stack: next greater element problem',
  'Stack: practice problems',
  'Queue: concept & implementation (using C# Queue<T>)',
  'Queue: circular queue',
  'Queue: deque (double-ended queue)',
  'Queue: practice — implement a stack using two queues',
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
  'Dynamic Programming: concept — memoization vs tabulation',
  'DP: Fibonacci with DP, climbing stairs',
  'DP: 0/1 knapsack problem',
  'DP: longest common subsequence',
  'DP: practice problems',
  'Greedy algorithms: concept & examples (activity selection, coin change)',
  'Greedy: practice problems',
  'Full mixed revision — one problem from every topic covered',
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
  'Repository Pattern — implement for your API',
  'Unit of Work Pattern',
  'Factory Pattern',
  'Singleton & DI lifetimes (Transient/Scoped/Singleton)',
  'CQRS Pattern — concept & simple implementation',
  'Strategy & Decorator Patterns — apply to the API',
  'Clean Architecture — layers overview (Domain/Application/Infra/API)',
  'Restructure project into Clean Architecture layers',
  'Move business logic into Application layer (Services/UseCases)',
  'MediatR — introduce for CQRS + Clean Architecture',
  'Clean Architecture — review & refactor full project',
  'Redis basics — install, StackExchange.Redis setup',
  'Implement caching for GET endpoints',
  'Cache invalidation strategies',
  'Distributed caching concepts',
  'Redis — practice: cache a heavy query end-to-end',
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
  'SignalR basics — Hubs & Clients',
  'Implement a real-time notification Hub in your API',
  'SignalR groups & connection management',
  'SignalR — client integration (JS/Angular)',
  'SignalR — practice: real-time feature end-to-end',
  'xUnit basics — writing your first tests',
  'Moq — mocking dependencies',
  'Unit testing — Services & Repositories layer',
  'Unit testing — Controllers layer',
  'Unit testing — practice: cover core API logic',
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
  'RabbitMQ basics — exchanges, queues, bindings',
  'RabbitMQ — producer implementation in .NET',
  'RabbitMQ — consumer implementation in .NET',
  'RabbitMQ — message patterns (pub/sub, work queues)',
  'RabbitMQ — error handling & dead-letter queues',
  'RabbitMQ — practice: order-processing flow end-to-end',
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
  'Polish Web API project — README, clean code pass',
  'Polish Microservices project — README, clean code pass',
  'Push both projects to GitHub, write project descriptions',
  'Update resume with new skills & projects',
  'Final revision — review weak topics across DSA/.NET',
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

// Certs are sequential blocks, not parallel: AI-200 for days 1-20, then AZ-900 for days 21-40.
// From day 41 onward neither cert has a daily item — both are already done.
function certItem(day) {
  if (day <= 20) {
    return { subject: 'AI-200', topic: AI200[day - 1], minutes: 180 };
  }
  if (day <= 40) {
    return { subject: 'AZ-900', topic: AZ900[day - 21], minutes: 100 };
  }
  return null;
}

function pythonTopic(day) {
  if (day <= 22) return `Udemy Python Course — Section ${day}`;
  if (day === 23) return 'Python course — full revision & wrap-up';
  return `Python Practice — Problem Set ${day - 23}`;
}

function sqlTopic(day) {
  if (day <= SQL_CORE.length) return SQL_CORE[day - 1];
  return `SQL Practice — Problem Set ${day - SQL_CORE.length}`;
}

function generateRoadmap() {
  const days = [];
  for (let day = 1; day <= 90; day++) {
    const items = [];
    const cert = certItem(day);
    if (cert) {
      items.push({ id: `d${day}-cert`, subject: cert.subject, topic: cert.topic, minutes: cert.minutes });
    }
    items.push({ id: `d${day}-dsa`, subject: 'DSA', topic: DSA[day - 1], minutes: 100 });
    items.push({ id: `d${day}-py`, subject: 'Python', topic: pythonTopic(day), minutes: 60 });
    items.push({ id: `d${day}-sql`, subject: 'SQL', topic: sqlTopic(day), minutes: 25 });
    items.push({ id: `d${day}-net`, subject: '.NET', topic: DOTNET[day - 1], minutes: 90 });
    days.push({ day, week: Math.ceil(day / 6), items });
  }
  return days;
}

const outDir = join(__dirname, '..', 'src', 'assets');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'roadmap-data.json');
writeFileSync(outPath, JSON.stringify(generateRoadmap(), null, 2) + '\n', 'utf-8');
console.log('Wrote', outPath);
