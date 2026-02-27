# Monitoring and Alerting Specification: Better Auth Utilities

## Overview

- **Service Name**: Better Auth Utilities
- **Purpose**: Type-safe Effect-TS wrappers for Better Auth SDK
- **Related Design**: [Technical Design Document](technical-design-doc.md)
- **Test Strategy**: [Test Strategy](../2-definition/test-strategy.md)
- **Monitoring Tooling**: Effect Tracing, Consumer-provided telemetry

---

## Important Note

As a library (not a service), Better Auth Utilities provides **observability hooks** that consumers integrate with their monitoring infrastructure. This spec defines:

1. Built-in tracing spans
2. Recommended metrics for consumers to collect
3. Suggested alerting thresholds

---

## Service Level Objectives (SLOs)

Recommended SLOs for consumer applications using this library:

| SLI | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Operation Success Rate | 99.5% | Successful / Total operations | Rolling 5 min |
| Input Validation Success | 99.9% | Valid inputs / Total inputs | Rolling 5 min |
| API Call Latency (p99) | < 500ms | 99th percentile duration | Rolling 5 min |
| Error Rate (ApiError) | < 1% | ApiError count / Total | Rolling 5 min |

### NFR Alignment

Per [Acceptance Criteria](../2-definition/acceptance-criteria.md):

| NFR | Monitoring Approach |
|-----|---------------------|
| Operations add <5ms overhead | Measure span duration delta |
| No sync blocking | Async operation verification |
| Memory <1KB per operation | Heap profiling in dev |

---

## Built-in Tracing

### Effect.withSpan Integration

Every controller and service includes tracing spans:

```typescript
// Controller span
Effect.withSpan("signInSocialServerController")

// Service span (nested)
Effect.withSpan("signInSocialServerService")
```

### Span Hierarchy

```
[Controller Span: signInSocialServerController]
  |
  +-- Schema.decodeUnknown (implicit)
  |
  +-- [Service Span: signInSocialServerService]
        |
        +-- Effect.tryPromise (Better Auth API call)
```

### Span Names by Operation

| User Story | Controller Span | Service Span |
|------------|-----------------|--------------|
| US-001 | signInSocialServerController | signInSocialServerService |
| US-002 | callbackOAuthServerController | callbackOAuthServerService |
| US-003 | linkSocialAccountServerController | linkSocialAccountServerService |
| US-004 | getSessionServerController | getSessionServerService |
| US-005 | listSessionsServerController | listSessionsServerService |
| US-006 | refreshTokenServerController | refreshTokenServerService |
| US-007 | getAccessTokenServerController | getAccessTokenServerService |
| US-008 | revokeSessionServerController | revokeSessionServerService |
| US-009 | revokeSessionsServerController | revokeSessionsServerService |
| US-010 | revokeOtherSessionsServerController | revokeOtherSessionsServerService |
| US-011 | accountInfoServerController | accountInfoServerService |
| US-012 | listUserAccountsServerController | listUserAccountsServerService |
| US-013 | unlinkAccountServerController | unlinkAccountServerService |
| US-014 | updateUserServerController | updateUserServerService |
| US-015 | deleteUserServerController | deleteUserServerService |
| US-016 | deleteUserCallbackServerController | deleteUserCallbackServerService |

### Span Attributes

Consumers can add attributes via Effect's tracing:

```typescript
import { Effect } from "effect";

const enrichedController = (input: unknown) =>
  signInSocialServerController(input).pipe(
    Effect.tap(() => Effect.annotateCurrentSpan("user.provider", "github")),
  );
```

---

## Metrics

### Application Metrics

Consumers should instrument these metrics:

#### Request Count

| Metric Name | Type | Labels | Description |
|-------------|------|--------|-------------|
| `bau_operation_total` | Counter | `operation`, `status`, `error_type` | Total operation invocations |

```typescript
// Example: Prometheus counter
bau_operation_total{operation="signInSocial", status="success"} 1234
bau_operation_total{operation="signInSocial", status="error", error_type="InputError"} 12
bau_operation_total{operation="signInSocial", status="error", error_type="ApiError"} 5
```

#### Request Duration

| Metric Name | Type | Labels | Description |
|-------------|------|--------|-------------|
| `bau_operation_duration_seconds` | Histogram | `operation` | Operation duration |

Recommended buckets: `[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5]`

#### Active Operations

| Metric Name | Type | Labels | Description |
|-------------|------|--------|-------------|
| `bau_operation_in_flight` | Gauge | `operation` | Currently executing operations |

### Error Metrics

| Metric Name | Type | Labels | Description |
|-------------|------|--------|-------------|
| `bau_error_total` | Counter | `error_type`, `operation` | Error count by type |

Error types (from `src/lib/errors/`):
- `InputError` - Schema validation failure
- `ApiError` - Better Auth API failure
- `SessionError` - Session-related failure
- `DataMissingError` - Expected data not found
- `DependenciesError` - Layer dependency failure

### Business Metrics by Epic

| Metric Name | Type | Labels | Epic | Description |
|-------------|------|--------|------|-------------|
| `bau_oauth_signins_total` | Counter | `provider`, `success` | E-001 | OAuth sign-in attempts |
| `bau_oauth_callbacks_total` | Counter | `provider`, `success` | E-001 | OAuth callback processing |
| `bau_sessions_active` | Gauge | - | E-002 | Current active sessions |
| `bau_sessions_revoked_total` | Counter | `scope` | E-002 | Revoked sessions (single/all/others) |
| `bau_accounts_linked_total` | Counter | `provider` | E-003 | OAuth accounts linked |
| `bau_accounts_unlinked_total` | Counter | `provider` | E-003 | OAuth accounts unlinked |
| `bau_users_updated_total` | Counter | - | E-004 | User profile updates |
| `bau_users_deleted_total` | Counter | - | E-004 | User deletions |

---

## Instrumentation Pattern

### Consumer Integration Example

```typescript
import { Effect, Layer } from "effect";
import { signInSocialServerController, InputError, ApiError } from "@emperorrag/better-auth-utilities";

// Metrics collector (example with Effect)
const withMetrics = <A, E, R>(
  operation: string,
  effect: Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    const startTime = Date.now();
    
    yield* Effect.annotateCurrentSpan("operation", operation);
    
    try {
      const result = yield* effect;
      recordMetric("bau_operation_total", { operation, status: "success" });
      recordDuration("bau_operation_duration_seconds", operation, Date.now() - startTime);
      return result;
    } catch (error) {
      const errorType = error instanceof InputError ? "InputError" : 
                        error instanceof ApiError ? "ApiError" : "Unknown";
      recordMetric("bau_operation_total", { operation, status: "error", error_type: errorType });
      throw error;
    }
  });

// Usage
const instrumentedSignIn = (input: unknown) =>
  withMetrics("signInSocial", signInSocialServerController(input));
```

### OpenTelemetry Integration

```typescript
import { NodeSdk } from "@effect/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

// Configure OpenTelemetry SDK
const OtelLive = NodeSdk.layer(() => ({
  resource: { serviceName: "my-app" },
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
  ),
}));

// Provide to Effect runtime
const program = signInSocialServerController(input).pipe(
  Effect.provide(AuthLive),
  Effect.provide(OtelLive),
);
```

---

## Alerts

### Critical Alerts

| Alert | Condition | Severity | Epic | Runbook |
|-------|-----------|----------|------|---------|
| High Error Rate | `bau_error_total / bau_operation_total > 5%` for 5m | Critical | All | Check Better Auth SDK status |
| API Latency Spike | `p99(bau_operation_duration_seconds) > 2s` for 5m | Critical | All | Check database/network |
| OAuth Provider Down | `bau_error_total{error_type="ApiError", operation=~"signInSocial|callbackOAuth"} > 10` for 1m | Critical | E-001 | Check OAuth provider status |

### Warning Alerts

| Alert | Condition | Severity | Epic | Runbook |
|-------|-----------|----------|------|---------|
| Elevated Input Errors | `bau_error_total{error_type="InputError"} > 50` for 5m | Warning | All | Review client validation |
| Session Errors Rising | `bau_error_total{error_type="SessionError"} > 20` for 5m | Warning | E-002 | Check session config |
| Slow Operations | `p95(bau_operation_duration_seconds) > 1s` for 10m | Warning | All | Review query performance |
| High Unlink Rate | `rate(bau_accounts_unlinked_total[1h]) > 10` | Warning | E-003 | Monitor user behavior |

### Alert Configuration (Example)

```yaml
# Prometheus AlertManager example
groups:
  - name: better-auth-utilities
    rules:
      - alert: HighAuthErrorRate
        expr: |
          sum(rate(bau_error_total[5m])) / sum(rate(bau_operation_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate in Better Auth operations"
          description: "Error rate is {{ $value | humanizePercentage }} over 5 minutes"
      
      - alert: AuthLatencySpike
        expr: |
          histogram_quantile(0.99, sum(rate(bau_operation_duration_seconds_bucket[5m])) by (le)) > 2
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Auth operation latency spike"
          description: "p99 latency is {{ $value }}s"
```

---

## Logging Requirements

### Log Levels

| Level | Usage |
|-------|-------|
| `ERROR` | ApiError, SessionError, DependenciesError |
| `WARN` | InputError (validation failure) |
| `INFO` | Successful operation completion |
| `DEBUG` | Operation parameters (sanitized) |
| `TRACE` | Full span details |

### Required Fields

```typescript
interface LogEntry {
  timestamp: string;       // ISO 8601
  level: string;           // ERROR, WARN, INFO, DEBUG, TRACE
  operation: string;       // Controller name
  traceId?: string;        // Effect span trace ID
  spanId?: string;         // Effect span ID
  userId?: string;         // If available from session
  errorType?: string;      // _tag of error (InputError, ApiError, etc.)
  errorMessage?: string;   // Error message
  duration?: number;       // Operation duration ms
}
```

### Structured Logging Format

```json
{
  "timestamp": "2026-01-03T10:00:00.000Z",
  "level": "ERROR",
  "operation": "signInSocialServerController",
  "traceId": "abc123",
  "spanId": "def456",
  "errorType": "ApiError",
  "errorMessage": "OAuth provider unavailable",
  "duration": 1523
}
```

### Effect Logging Integration

```typescript
import { Effect, Logger, LogLevel } from "effect";

// Configure Effect logger
const LoggerLive = Logger.replace(
  Logger.defaultLogger,
  Logger.json({
    format: "structured",
  }),
);

// Add to program
const program = signInSocialServerController(input).pipe(
  Effect.provide(AuthLive),
  Effect.provide(LoggerLive),
  Logger.withMinimumLogLevel(LogLevel.Debug),
);
```

---

## Dashboards

### Service Overview Dashboard

**Panels:**

1. **Operation Rate** - Stacked area chart by operation
   - Query: `sum(rate(bau_operation_total[5m])) by (operation)`

2. **Error Rate** - Line chart with threshold
   - Query: `sum(rate(bau_error_total[5m])) / sum(rate(bau_operation_total[5m]))`

3. **Latency Percentiles** - Line chart (p50, p95, p99)
   - Query: `histogram_quantile(0.99, sum(rate(bau_operation_duration_seconds_bucket[5m])) by (le))`

4. **Errors by Type** - Stacked bar chart
   - Query: `sum(rate(bau_error_total[5m])) by (error_type)`

5. **Operations by Epic** - Table grouped by E-001, E-002, E-003, E-004
   - Query: `topk(10, sum(rate(bau_operation_total[5m])) by (operation))`

### Epic-Specific Dashboards

**E-001 OAuth Dashboard:**
- OAuth sign-in attempts by provider
- Callback success rate
- Provider error rates

**E-002 Session Dashboard:**
- Active sessions gauge
- Session revocation rate
- Token refresh frequency

**E-003 Account Dashboard:**
- Account linking/unlinking rate
- Provider distribution

**E-004 User Dashboard:**
- Profile update rate
- User deletion trend

---

## Health Checks

### Readiness Check

Consumer applications should implement:

```typescript
import { Effect, Duration } from "effect";
import { AuthServerTag } from "@emperorrag/better-auth-utilities";

const healthCheck = Effect.gen(function* () {
  // Verify AuthServerTag is available
  const authServer = yield* AuthServerTag;
  
  // Verify database connectivity via Better Auth
  // (Better Auth handles this internally)
  
  return { status: "ready" };
}).pipe(
  Effect.timeout(Duration.seconds(5)),
  Effect.catchAll(() => Effect.succeed({ status: "not_ready" })),
);
```

### Liveness Check

```typescript
const livenessCheck = Effect.succeed({ status: "alive" });
```

---

## Ownership

| Component | Owner | Contact |
|-----------|-------|---------|
| Library Spans | Library Team | N/A |
| Metrics Collection | Consumer Team | Consumer-specific |
| Alert Configuration | Consumer Team | Consumer-specific |
| Dashboard Maintenance | Consumer Team | Consumer-specific |

---

## Traceability

| Epic | Operations | Recommended Metrics |
|------|------------|---------------------|
| E-001 | US-001, US-002, US-003 | OAuth sign-ins, callbacks, links |
| E-002 | US-004–US-010 | Sessions active, revoked |
| E-003 | US-011, US-012, US-013 | Accounts linked/unlinked |
| E-004 | US-014, US-015, US-016 | Users updated/deleted |

---

## Change History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | Backend Engineer | Initial monitoring spec aligned with codebase |
