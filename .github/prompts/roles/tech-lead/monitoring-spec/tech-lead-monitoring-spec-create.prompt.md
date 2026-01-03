---
description: 'Create a monitoring and alerting specification for a service'
agent: 'Tech Lead'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*']
---

# Create Monitoring and Alerting Specification

You are a Tech Lead creating a monitoring and alerting specification. Your goal is to define observability requirements: metrics, logs, alerts, and SLIs/SLOs.

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
6. **Plan Dashboards** - Outline dashboard needs

## Output Structure

Generate a monitoring specification with:

### Overview
- Service name and purpose
- Related design documents
- Monitoring tooling used

### Service Level Objectives (SLOs)

| SLI | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Availability | 99.9% | Successful requests / Total requests | 30 days |
| Latency (p99) | < 200ms | 99th percentile response time | Rolling 5 min |
| Error Rate | < 0.1% | Error responses / Total responses | Rolling 5 min |

### Metrics

#### Application Metrics
- Request count (by endpoint, method, status)
- Request duration (histogram)
- Active connections
- [Service-specific metrics]

#### Business Metrics
- [Key business transactions]
- [Business-critical counters]

#### Infrastructure Metrics
- CPU utilization
- Memory usage
- Disk I/O
- Network I/O

### Alerts

| Alert | Condition | Severity | Runbook |
|-------|-----------|----------|---------|
| High Error Rate | error_rate > 1% for 5m | Critical | [Link] |
| High Latency | p99_latency > 500ms for 10m | Warning | [Link] |
| Service Down | healthy_instances = 0 | Critical | [Link] |

### Logging Requirements

#### Log Levels
- ERROR: Exceptions and failures
- WARN: Degraded operation
- INFO: Key business events
- DEBUG: Troubleshooting detail

#### Required Fields
- timestamp
- request_id / correlation_id
- service_name
- [Additional required fields]

### Dashboards

#### Service Overview Dashboard
- Request rate and error rate
- Latency percentiles
- Dependency health
- Resource utilization

#### [Additional Dashboards]

## Quality Gate

The spec is complete when:
- [ ] SLIs and SLOs defined
- [ ] Alert thresholds calibrated
- [ ] Dashboards designed
- [ ] Reviewed by operations