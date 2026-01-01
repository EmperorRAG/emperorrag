---
description: 'Template and guidelines for Runbook'
applyTo: '**/runbook/**/*.md, **/*-runbook.md'
---

# Runbook

A runbook provides operational procedures, troubleshooting steps, and escalation paths for maintaining and operating a service in production.

## When to Use

- Documenting operational procedures
- On-call reference for troubleshooting
- Incident response guidance
- Knowledge transfer for operations

## Template

```markdown
# Runbook: [Service Name]

## Overview

- **Service Name**: [Name]
- **Team**: [Owning Team]
- **On-Call Rotation**: [PagerDuty/OpsGenie link]
- **Last Updated**: [Date]
- **Owner**: [Name]

### Quick Links

| Resource | Link |
|----------|------|
| Monitoring Dashboard | [Link] |
| Logs | [Link] |
| Alerting | [Link] |
| Deployment | [Link] |
| Source Code | [Link] |

---

## Service Architecture

### Overview
[Brief description of the service and its purpose]

### Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| [Component 1] | [Purpose] | [Tech] |
| [Component 2] | [Purpose] | [Tech] |
| [Component 3] | [Purpose] | [Tech] |

### Dependencies

| Dependency | Type | Impact if Down |
|------------|------|----------------|
| [Database] | Internal | Service unavailable |
| [Cache] | Internal | Degraded performance |
| [External API] | External | [Feature] unavailable |

---

## Health Checks

### Endpoints

| Endpoint | Purpose | Expected Response |
|----------|---------|-------------------|
| `/health` | Basic health | 200 OK |
| `/health/ready` | Readiness | 200 OK when ready |
| `/health/live` | Liveness | 200 OK when alive |

### Manual Health Check

```bash
curl -s https://[service-url]/health | jq .
```

Expected output:
```json
{
  "status": "healthy",
  "version": "1.2.3",
  "uptime": "24h30m"
}
```

---

## Common Operations

### Restarting the Service

**When to use**: Service is unresponsive or in a bad state

```bash
# Kubernetes
kubectl rollout restart deployment/[service-name] -n [namespace]

# Check status
kubectl rollout status deployment/[service-name] -n [namespace]
```

### Scaling the Service

**When to use**: High load or performance issues

```bash
# Scale up
kubectl scale deployment/[service-name] --replicas=5 -n [namespace]

# Scale down
kubectl scale deployment/[service-name] --replicas=2 -n [namespace]
```

### Viewing Logs

```bash
# Recent logs
kubectl logs -l app=[service-name] -n [namespace] --tail=100

# Follow logs
kubectl logs -l app=[service-name] -n [namespace] -f

# Logs from specific time
kubectl logs -l app=[service-name] -n [namespace] --since=1h
```

### Checking Configuration

```bash
kubectl get configmap [config-name] -n [namespace] -o yaml
kubectl get secret [secret-name] -n [namespace] -o yaml
```

---

## Troubleshooting

### High Error Rate

**Symptoms**: Error rate > 1% on dashboard

**Diagnosis Steps**:
1. Check error logs for patterns
   ```bash
   kubectl logs -l app=[service-name] -n [namespace] | grep -i error | tail -50
   ```
2. Check dependency health
3. Review recent deployments
4. Check resource utilization

**Common Causes**:
| Cause | Indicators | Resolution |
|-------|------------|------------|
| Database connection issues | Connection timeout errors | Check DB health, connection pool |
| Memory pressure | OOM errors in logs | Increase memory limits or restart |
| Bad deployment | Errors started after deploy | Rollback to previous version |

**Resolution**:
- If DB issue: [Escalate to DBA / Check connection pool]
- If memory: Restart pods or scale horizontally
- If deployment: Roll back

### High Latency

**Symptoms**: p99 latency > 2s

**Diagnosis Steps**:
1. Check dashboard for slow endpoints
2. Review database query times
3. Check external dependency latency
4. Review CPU utilization

**Common Causes**:
| Cause | Indicators | Resolution |
|-------|------------|------------|
| Slow database queries | DB latency spike | Optimize queries, add indexes |
| External service slow | External API latency high | Enable circuit breaker, add caching |
| CPU throttling | High CPU utilization | Scale horizontally |

### Service Unavailable

**Symptoms**: All requests failing, health check failing

**Diagnosis Steps**:
1. Check if pods are running
   ```bash
   kubectl get pods -l app=[service-name] -n [namespace]
   ```
2. Check pod events
   ```bash
   kubectl describe pod [pod-name] -n [namespace]
   ```
3. Check logs for crash reasons
4. Verify dependencies are up

**Common Causes**:
| Cause | Indicators | Resolution |
|-------|------------|------------|
| Pods crashing | CrashLoopBackOff status | Check logs, fix issue, restart |
| Failed deployment | ImagePullBackOff | Check image name, registry access |
| Config error | Immediate crash on start | Check ConfigMaps, Secrets |

### Database Connection Issues

**Symptoms**: Database connection errors in logs

**Diagnosis Steps**:
1. Check database health
2. Verify connection string
3. Check connection pool metrics
4. Verify network connectivity

**Resolution**:
```bash
# Check current connections
[database-specific command]

# Restart to reset connection pool
kubectl rollout restart deployment/[service-name] -n [namespace]
```

---

## Deployment

### Standard Deployment

```bash
# Deploy new version
[deployment command or CI/CD link]

# Verify deployment
kubectl rollout status deployment/[service-name] -n [namespace]
```

### Rollback

**When to use**: Issues detected after deployment

```bash
# Rollback to previous version
kubectl rollout undo deployment/[service-name] -n [namespace]

# Rollback to specific revision
kubectl rollout undo deployment/[service-name] -n [namespace] --to-revision=[N]

# Check rollout history
kubectl rollout history deployment/[service-name] -n [namespace]
```

---

## Alerts

### [Alert Name 1]

**Severity**: Critical
**Description**: [What the alert means]
**Impact**: [User/business impact]

**Runbook**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Escalation**: If not resolved in [time], escalate to [team/person]

---

### [Alert Name 2]

**Severity**: Warning
**Description**: [What the alert means]
**Impact**: [User/business impact]

**Runbook**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Escalation

| Level | Who | When | Contact |
|-------|-----|------|---------|
| L1 | On-call engineer | Initial response | [PagerDuty] |
| L2 | Service owner | 30 min without resolution | [Contact] |
| L3 | Tech Lead | Critical issue, 1 hour | [Contact] |
| L4 | Engineering Manager | Major outage | [Contact] |

---

## Maintenance Tasks

### [Periodic Task 1]

**Frequency**: [Daily/Weekly/Monthly]
**Purpose**: [Why this is needed]

```bash
[commands to execute]
```

### [Periodic Task 2]

**Frequency**: [Frequency]
**Purpose**: [Why this is needed]

```bash
[commands to execute]
```

---

## Disaster Recovery

### Backup Procedures

[Description of backup strategy]

```bash
# Manual backup command
[command]
```

### Restore Procedures

**Prerequisites**: [What's needed before restore]

```bash
# Restore command
[command]
```

---

## Related Documentation

- [Technical Design](link)
- [Monitoring Spec](link)
- [Architecture Diagrams](link)
```

## Quality Criteria

- [ ] All common operations documented
- [ ] Troubleshooting for all known issues
- [ ] Alert-specific runbooks for each alert
- [ ] Escalation paths clear
- [ ] Commands tested and verified
- [ ] Reviewed by operations team
- [ ] Updated after each incident
