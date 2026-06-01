# API Architecture

## API Principles

- REST for resource operations, GraphQL for flexible dashboard queries, and WebSockets for live workspace collaboration and generation progress.
- All external APIs are versioned under `/v1`.
- Every request carries tenant context, authenticated principal context, correlation ID, and policy metadata.
- All write operations are idempotent where practical.
- API output includes machine-readable error codes and human-readable explanations.

## REST API Surface

| Domain | Endpoint Examples | Purpose |
| --- | --- | --- |
| Auth | `POST /v1/auth/register`, `POST /v1/auth/login`, `POST /v1/auth/oauth/callback`, `POST /v1/auth/refresh`, `POST /v1/auth/logout` | Guest, email, OAuth, SSO, sessions, tokens |
| Organizations | `GET /v1/orgs`, `POST /v1/orgs`, `PATCH /v1/orgs/{orgId}` | Tenant management |
| Workspaces | `GET /v1/workspaces`, `POST /v1/workspaces` | Workspace lifecycle |
| Projects | `POST /v1/projects`, `GET /v1/projects/{projectId}`, `PATCH /v1/projects/{projectId}` | Project lifecycle and roadmap |
| Prompts | `POST /v1/projects/{projectId}/prompts` | Natural-language input |
| Generations | `POST /v1/projects/{projectId}/generations`, `GET /v1/generations/{generationId}` | AI generation jobs |
| Files | `GET /v1/projects/{projectId}/files`, `PUT /v1/projects/{projectId}/files/{path}` | Workspace files |
| Preview | `POST /v1/projects/{projectId}/preview`, `GET /v1/previews/{previewId}` | Live preview builds |
| Deployments | `POST /v1/projects/{projectId}/deployments`, `GET /v1/deployments/{deploymentId}` | Deployment management |
| Billing | `GET /v1/billing/usage`, `POST /v1/billing/checkout`, `POST /v1/billing/webhooks` | Plans and metering |
| Admin | `GET /v1/admin/metrics`, `GET /v1/admin/audit-logs` | Operations and governance |

## Generation Request Contract

```json
{
  "prompt": "Create a SaaS CRM for small businesses with leads, pipelines, billing, and admin dashboard.",
  "target": {
    "platform": "web_app",
    "frontend": "nextjs",
    "backend": "nodejs",
    "database": "postgresql",
    "deployment": "kubernetes"
  },
  "preferences": {
    "language": "simple",
    "theme": "modern-blue",
    "askFollowUps": true,
    "includeTests": true,
    "includeDocs": true
  },
  "policy": {
    "allowedProviders": ["openai", "claude", "private-local"],
    "maxCostCents": 500,
    "dataRetention": "project_default"
  }
}
```

## Generation Response Contract

```json
{
  "generationId": "gen_123",
  "status": "queued",
  "estimatedComplexity": "high",
  "missingInformation": [
    "Which payment provider should be used?",
    "Do you need multi-currency billing?"
  ],
  "roadmapPreview": [
    "Requirements clarification",
    "Architecture and database design",
    "Frontend and backend generation",
    "Security review",
    "Testing and deployment"
  ],
  "streamUrl": "wss://api.jarvis-builder.example/v1/generations/gen_123/stream"
}
```

## GraphQL API

GraphQL is used for dashboard composition where clients need nested data. Example types:

```graphql
type Project {
  id: ID!
  name: String!
  type: ProjectType!
  status: ProjectStatus!
  roadmap: JSON!
  files: [ProjectFile!]!
  generations: [Generation!]!
  deployments: [Deployment!]!
}

type Generation {
  id: ID!
  taskType: String!
  status: GenerationStatus!
  selectedModels: JSON!
  agentRuns: [AgentRun!]!
  costCents: Int!
}
```

## WebSocket Channels

| Channel | Events |
| --- | --- |
| `project:{projectId}:workspace` | file_changed, cursor_moved, comment_added, snapshot_created |
| `generation:{generationId}` | queued, agent_started, partial_result, patch_ready, validation_result, completed, failed |
| `deployment:{deploymentId}` | build_started, health_check, promoted, rollback_started, failed |

## API Generation Capabilities

The API Agent can generate:

- REST APIs with OpenAPI specifications, validation, authentication, authorization, pagination, filtering, idempotency, and error contracts.
- GraphQL APIs with schema, resolvers, dataloaders, authorization directives, query limits, and persisted queries.
- WebSocket APIs with authenticated subscriptions, event schemas, replay handling, and rate limits.
- SDKs, API documentation, Postman collections, test suites, and mock servers.

## Validation and Safety

- Validate all request bodies with schema validators before reaching business logic.
- Enforce authentication before tenant-scoped resource access.
- Enforce authorization at service and data-access layers.
- Reject unsafe code-generation requests that attempt credential theft, policy bypass, malware, unauthorized scraping, or privilege escalation.
- Store provider credentials only in encrypted secret stores and never expose them to generated projects unless the owner explicitly configures deployment secrets.
