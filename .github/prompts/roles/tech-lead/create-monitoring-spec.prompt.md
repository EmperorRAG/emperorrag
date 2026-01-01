---
description: 'Create a monitoring and alerting specification with SLOs, metrics, and alerts'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo']
---

# Create Monitoring & Alerting Specification

You are a Tech Lead creating a monitoring specification. Your goal is to define SLOs, metrics, and alerts that enable effective service observability.

## Inputs Required

- ${input:serviceName:Name of the service}
- ${input:criticality:Service criticality level}
- ${input:designDocReference:Reference to design document}

## Workflow

1. **Define SLOs** - Establish service level objectives
2. **Identify Metrics** - Determine key metrics to track
3. **Design Alerts** - Create alert rules and thresholds
4. **Plan Dashboards** - Outline dashboard requirements
5. **Assign Ownership** - Define who responds to alerts

## Output Structure

Generate a monitoring specification with:

### Overview
- Service name and purpose
- Criticality and SLA requirements
- Monitoring ownership

### Service Level Objectives (SLOs)

| SLO | Target | Measurement | Error Budget |
|-----|--------|-------------|--------------|
| Availability | 99.9% | Successful requests / Total requests | 43.8 min/month |
| Latency (p50) | < 100ms | Response time percentile | N/A |
| Latency (p99) | < 500ms | Response time percentile | N/A |

### Key Metrics

#### Golden Signals
- **Latency:** Request duration metrics
- **Traffic:** Request rate metrics
- **Errors:** Error rate metrics
- **Saturation:** Resource utilization metrics

#### Custom Metrics
- Business-specific metrics
- Feature usage metrics
- Dependency health metrics

### Alerting Rules

| Alert | Condition | Severity | Response |
|-------|-----------|----------|----------|
| High Error Rate | Error rate > 5% for 5 min | Critical | Page on-call |
| High Latency | p99 > 1s for 5 min | Warning | Notify channel |
| Service Down | No requests for 2 min | Critical | Page on-call |

### Alert Definitions

#### [Alert Name]
- **Condition:** [Threshold expression]
- **Duration:** [How long condition must persist]
- **Severity:** [Critical/Warning/Info]
- **Response:** [Who gets notified, how]
- **Runbook:** [Link to relevant runbook]

### Dashboards
- Overview dashboard requirements
- Detailed investigation dashboard
- SLO tracking dashboard

### On-Call Responsibilities
- Alert ownership
- Response expectations
- Escalation process

## Quality Gate

The spec is complete when:
- [ ] Metrics and thresholds defined
- [ ] Alerts tested
- [ ] Ownership assigned
- [ ] Dashboards planned