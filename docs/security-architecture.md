# Security Architecture

## Security Objectives

Jarvis Builder must protect user data, generated code, secrets, billing information, AI provider credentials, and deployment environments while still enabling fast AI-powered creation.

## Authentication

- Guest mode with temporary, scoped sessions and limited quotas.
- Email login with Argon2id password hashing, email verification, password reset, and optional MFA.
- OAuth login for approved identity providers.
- Enterprise SSO with SAML or OIDC.
- Session rotation, refresh-token rotation, device tracking, and suspicious-session revocation.
- API keys with scoped permissions, expiration, and last-used tracking.

## Authorization

- Role-based access control for owner, admin, builder, reviewer, billing manager, and viewer.
- Attribute-based checks for tenant, workspace, project, environment, deployment, and billing scope.
- Service-layer authorization and database row-level security for high-sensitivity tenants.
- Separate permissions for reading files, editing files, invoking AI providers, deploying, managing secrets, and viewing billing.

## Input Validation

- Validate all API payloads with explicit schemas.
- Validate AI-generated code artifacts before saving, building, or deploying.
- Sanitize filenames, paths, uploaded archives, URLs, and generated shell commands.
- Block path traversal, SSRF, prompt-injection exfiltration, unsafe redirects, and oversized payloads.

## Encryption and Secret Management

- TLS 1.3 for traffic in transit.
- Envelope encryption for sensitive data at rest.
- Managed secret store for OAuth secrets, AI provider keys, deployment tokens, and billing webhook secrets.
- Per-tenant encryption keys for enterprise plans where available.
- Secrets are injected only into authorized sandbox or deployment environments and never into model prompts unless explicitly approved and redacted.

## Rate Limiting and Abuse Prevention

- Per-IP, per-user, per-tenant, per-token, and per-endpoint rate limits.
- AI generation quota by plan, model, task type, and cost cap.
- Build sandbox quotas for CPU, memory, disk, runtime, and network egress.
- Abuse classifiers for credential theft, malware, phishing, unauthorized scraping, platform bypasses, and harmful automation.
- Human review queue for repeated high-risk behavior.

## Audit Logging

Audit logs must capture:

- Login, logout, failed login, MFA changes, API key creation, and token revocation.
- Project creation, deletion, sharing, export, deployment, rollback, and secret updates.
- AI provider selection, policy decisions, blocked requests, and admin overrides.
- Billing plan changes, invoice events, and quota overrides.

## Build Sandbox Security

- Ephemeral containers with non-root users.
- No privileged mode, host mounts, Docker socket access, or unrestricted network access.
- Egress allowlists for package registries and approved APIs.
- Dependency scanning, SAST, secret scanning, license scanning, and generated code review.
- Signed artifacts and provenance metadata.

## AI Security

- Prompt-injection detection for uploaded documents, websites, and repository content.
- Context boundary enforcement so retrieved content cannot override platform policy.
- Output validation before executing generated commands or deploying code.
- Provider isolation by tenant policy and data residency requirements.
- Sensitive data redaction before external model calls.

## Privacy Requirements

- Collect only necessary user, prompt, usage, and billing data.
- Provide data export, deletion, retention controls, and enterprise data-processing settings.
- Maintain clear consent for using third-party AI providers and payment providers.
- Do not train shared models on customer data unless the customer explicitly opts in under a valid policy.

## Secure Defaults

- New projects include authentication, authorization, input validation, logging, dependency pinning, error boundaries, and secure headers when applicable.
- Generated APIs include rate limits, request validation, pagination limits, and auth middleware.
- Generated databases include least-privilege roles, audit fields, indexes, migrations, and backup guidance.
