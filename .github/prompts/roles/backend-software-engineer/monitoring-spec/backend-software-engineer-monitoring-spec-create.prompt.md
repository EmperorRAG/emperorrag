---
description: 'Create a monitoring and alerting specification for a service'
agent: 'Backend Software Engineer'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*']
---

# Create Monitoring and Alerting Specification

You are a Backend Software Engineer creating a monitoring and alerting specification. Your goal is to define observability requirements: metrics, logs, alerts, and SLIs/SLOs.

## Inputs Required

- ${input:serviceName:Name of the service}
- ${input:designDocReference:Reference to related design document}
- ${input:sloTargets:Target SLOs for the service}

## Workflow

1. **Understand Service** - Review service design and dependencies
2. **Define SLIs/SLOs** - Establish service level indicators and objectives
3. **Design Metrics** - Specify key metrics to collect
4. **Define Alerts** - Create alerting rules with thresholds
5. **Specify Logging** - Define logging requirements

## Output Structure

Generate a monitoring specification with:

### Overview
- Service name and purpose
- Related design documents
- Monitoring tooling used

### Service Level Objectives (SLOs)

| SLI | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Availability | 99.9% | Successful requests / Total | 30 days |
| Latency (p99) | < 200ms | 99th percentile response | Rolling 5 min |

### Metrics

#### Application Metrics
- Request count (by endpoint, status)
- Request duration (histogram)
- Active connections

#### Business Metrics
- Key business transactions

#### Infrastructure Metrics
- CPU, memory, disk, network

### Alerts

| Alert | Condition | Severity | Runbook |
|-------|-----------|----------|---------|
| High Error Rate | error_rate > 1% for 5m | Critical | [Link] |

### Logging Requirements
- Log levels and usage
- Required fields
- Structured logging format

### Dashboards
- Service overview dashboard
- Debug/troubleshooting dashboard

## Quality Gate

The spec is complete when:
- [ ] SLIs and SLOs defined
- [ ] Alert thresholds calibrated
- [ ] Dashboards designed
- [ ] Reviewed by operations