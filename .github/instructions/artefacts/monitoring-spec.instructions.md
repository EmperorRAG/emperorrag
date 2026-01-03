---
description: 'Template and guidelines for Monitoring and Alerting Specification'
applyTo: '**/monitoring-spec/**/*.md, **/*-monitoring-spec.md'
---

# Monitoring and Alerting Specification

A monitoring specification defines observability requirements including metrics, logs, alerts, dashboards, and SLIs/SLOs for a service.

## When to Use

- Launching a new service
- Improving observability of existing services
- Defining SLOs for reliability
- Setting up alerting for production systems

## Template

```markdown
# Monitoring Specification: [Service Name]

## Overview

- **Service Name**: [Name]
- **Design Document**: [Link]
- **Owner**: [Team/Individual]
- **Last Updated**: [Date]

### Monitoring Stack

| Component | Tool |
|-----------|------|
| Metrics | [Prometheus/Datadog/CloudWatch] |
| Logging | [ELK/Splunk/CloudWatch] |
| Tracing | [Jaeger/Zipkin/X-Ray] |
| Alerting | [PagerDuty/OpsGenie/Slack] |
| Dashboards | [Grafana/Datadog/Kibana] |

---

## Service Level Objectives (SLOs)

### Primary SLOs

| SLI | Description | Target | Measurement | Window |
|-----|-------------|--------|-------------|--------|
| Availability | Successful requests / Total requests | 99.9% | HTTP 2xx+3xx / Total | 30 days rolling |
| Latency (p50) | Median response time | < 100ms | 50th percentile | Rolling 5 min |
| Latency (p99) | Tail response time | < 500ms | 99th percentile | Rolling 5 min |
| Error Rate | Failed requests / Total requests | < 0.1% | HTTP 5xx / Total | Rolling 5 min |

### Error Budget

| SLO | Budget (monthly) | Burn Rate Alert |
|-----|------------------|-----------------|
| Availability 99.9% | 43.2 minutes downtime | Alert if > 14.4x normal |
| Error Rate 0.1% | 4,320 errors per 1M requests | Alert if > 10x normal |

---

## Metrics

### Application Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `http_requests_total` | Counter | method, path, status | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | method, path | Request latency |
| `http_requests_in_flight` | Gauge | - | Active requests |
| `[custom_metric]` | [Type] | [Labels] | [Description] |

### Business Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `[business_operation]_total` | Counter | status, type | Business transactions |
| `[business_operation]_amount` | Histogram | type | Transaction values |

### Dependency Metrics

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `db_query_duration_seconds` | Histogram | query_type | Database query latency |
| `db_connections_active` | Gauge | - | Active DB connections |
| `external_api_requests_total` | Counter | service, status | External API calls |
| `external_api_duration_seconds` | Histogram | service | External API latency |

### Infrastructure Metrics

| Metric | Source | Description |
|--------|--------|-------------|
| CPU utilization | Container/Host | Percentage CPU used |
| Memory utilization | Container/Host | Percentage memory used |
| Disk I/O | Host | Read/write operations |
| Network I/O | Container/Host | Bytes in/out |

---

## Alerts

### Critical Alerts (Page Immediately)

| Alert | Condition | Duration | Runbook |
|-------|-----------|----------|---------|
| Service Down | `up == 0` | 1 min | [Link] |
| High Error Rate | `error_rate > 5%` | 5 min | [Link] |
| SLO Burn Rate Critical | `burn_rate > 14.4` | 5 min | [Link] |
| Database Unavailable | `db_up == 0` | 1 min | [Link] |

### Warning Alerts (Notify Team)

| Alert | Condition | Duration | Runbook |
|-------|-----------|----------|---------|
| Elevated Error Rate | `error_rate > 1%` | 10 min | [Link] |
| High Latency | `p99_latency > 1s` | 5 min | [Link] |
| Low Disk Space | `disk_free < 20%` | 15 min | [Link] |
| High Memory Usage | `memory_used > 85%` | 10 min | [Link] |
| SLO Burn Rate Warning | `burn_rate > 6` | 30 min | [Link] |

### Alert Configuration

```yaml
# Example Prometheus alert rule
groups:
  - name: service-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          runbook_url: "https://..."
```

---

## Logging

### Log Levels

| Level | Usage | Examples |
|-------|-------|----------|
| ERROR | Unexpected failures requiring attention | Unhandled exceptions, integration failures |
| WARN | Recoverable issues, degraded operation | Retry succeeded, fallback used |
| INFO | Normal operations, key events | Request processed, job completed |
| DEBUG | Detailed troubleshooting info | Query parameters, intermediate values |

### Structured Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "service": "[service-name]",
  "traceId": "abc123",
  "spanId": "def456",
  "message": "Request processed",
  "context": {
    "userId": "user-123",
    "operation": "createOrder",
    "duration_ms": 150
  }
}
```

### Required Log Fields

| Field | Required | Description |
|-------|----------|-------------|
| timestamp | Yes | ISO 8601 format |
| level | Yes | Log level |
| service | Yes | Service name |
| traceId | Yes | Distributed trace ID |
| message | Yes | Human-readable message |
| error | If applicable | Error details with stack |

### Sensitive Data

- **Never log**: Passwords, tokens, credit card numbers, SSN
- **Mask/Hash**: Email addresses, phone numbers, IP addresses
- **Allowed**: User IDs, session IDs (non-sensitive)

---

## Dashboards

### Service Overview Dashboard

| Panel | Visualization | Query |
|-------|---------------|-------|
| Request Rate | Time series | `rate(http_requests_total[1m])` |
| Error Rate | Time series | `rate(http_requests_total{status=~"5.."}[1m])` |
| Latency p50/p99 | Time series | `histogram_quantile(0.99, ...)` |
| SLO Status | Stat | Current SLO compliance |

### Debug Dashboard

| Panel | Purpose |
|-------|---------|
| Error breakdown by endpoint | Identify problematic endpoints |
| Latency by endpoint | Find slow endpoints |
| Dependency health | External service status |
| Resource usage | CPU/Memory/Disk trends |

---

## Tracing

### Instrumentation Requirements

| Component | Span Name | Tags |
|-----------|-----------|------|
| HTTP Handler | `HTTP {method} {path}` | method, path, status |
| Database | `DB {operation}` | db.type, db.statement |
| External API | `External {service}` | service, endpoint, status |

### Sampling Strategy

| Environment | Strategy | Rate |
|-------------|----------|------|
| Development | Always sample | 100% |
| Staging | Always sample | 100% |
| Production | Probabilistic | 10% (100% on error) |

---

## Related Documentation

- [Runbook](link)
- [Technical Design](link)
- [Incident Response](link)
```

## Quality Criteria

- [ ] SLIs and SLOs defined with clear targets
- [ ] All critical paths have metrics
- [ ] Alert thresholds calibrated based on baselines
- [ ] Dashboards designed for troubleshooting
- [ ] Logging standards documented
- [ ] Reviewed by operations team
