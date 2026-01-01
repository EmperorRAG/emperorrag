---
description: 'Template and guidelines for Test Strategy'
applyTo: '**/test-strategy/**/*.md, **/*-test-strategy.md'
---

# Test Strategy

A test strategy defines the overall testing approach, methodologies, and standards for a project or organization.

## When to Use

- Establishing project-wide testing standards
- Defining testing methodologies for new initiatives
- Creating testing governance documentation
- Onboarding new team members to testing practices

## Template

```markdown
# Test Strategy: [Project/Product Name]

## Document Info
- **Version**: [1.0]
- **Author**: [Name]
- **Approved By**: [Name]
- **Last Updated**: [Date]

---

## Purpose

[Define the purpose and goals of this test strategy document]

---

## Scope

### In Scope
- [Application/system components]
- [Test types covered]
- [Environments covered]

### Out of Scope
- [Excluded areas]
- [Reason for exclusion]

---

## Testing Objectives

1. Ensure functional correctness of all features
2. Validate non-functional requirements (performance, security)
3. Verify integration points between systems
4. Confirm accessibility compliance
5. Maintain regression stability

---

## Test Levels

### Unit Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | Developers |
| **Coverage Target** | >80% line coverage |
| **Framework** | Jest / Vitest |
| **Execution** | Pre-commit, CI pipeline |

### Integration Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | Developers / QA |
| **Scope** | API endpoints, service integration |
| **Framework** | Supertest, Testcontainers |
| **Execution** | CI pipeline, PR merge |

### System Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | QA Team |
| **Scope** | End-to-end user flows |
| **Framework** | Playwright |
| **Execution** | Staging environment |

### Acceptance Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | QA / Product |
| **Scope** | Business requirements validation |
| **Method** | Manual / Automated |
| **Execution** | Pre-release |

---

## Test Types

| Type | Priority | Approach | Automation |
|------|----------|----------|------------|
| Functional | P0 | Behavior-driven | 80% |
| Regression | P0 | Suite execution | 100% |
| Performance | P1 | Load testing | 100% |
| Security | P1 | SAST/DAST | 100% |
| Accessibility | P1 | Axe, manual | 70% |
| Compatibility | P2 | Browser matrix | 50% |
| Usability | P2 | Manual review | 0% |

---

## Test Environment Strategy

| Environment | Purpose | Data | Access |
|-------------|---------|------|--------|
| Local | Unit/Integration | Mock/In-memory | Developers |
| CI | Automated tests | Test fixtures | Automated |
| Staging | System/UAT | Sanitized prod | QA/Product |
| Production | Smoke tests | Production | Limited |

---

## Test Data Management

### Principles
- Use synthetic data for all non-production testing
- No PII in test environments
- Data fixtures versioned with code
- Factory patterns for dynamic data generation

### Data Sources
| Type | Source | Management |
|------|--------|------------|
| Unit test | Inline fixtures | In test files |
| Integration | Seed scripts | Version controlled |
| E2E | Test accounts | Managed fixtures |

---

## Automation Strategy

### Automation Pyramid

```
        /\
       /  \     E2E (10%)
      /----\    
     /      \   Integration (20%)
    /--------\  
   /          \ Unit (70%)
  /------------\
```

### Automation Criteria
- **Automate**: Regression, smoke, data-driven tests
- **Manual**: Exploratory, usability, edge cases

### Tools
| Purpose | Tool |
|---------|------|
| Unit Testing | Vitest / Jest |
| Integration | Supertest |
| E2E | Playwright |
| Performance | k6 |
| Security | OWASP ZAP |
| Accessibility | Axe |

---

## Defect Management

### Severity Levels

| Level | Definition | SLA |
|-------|------------|-----|
| Critical | System down, data loss | 4 hours |
| High | Major feature broken | 24 hours |
| Medium | Feature impaired | 1 week |
| Low | Minor issue | Next sprint |

### Defect Workflow
1. Report → 2. Triage → 3. Assign → 4. Fix → 5. Verify → 6. Close

---

## Metrics and Reporting

### Key Metrics
| Metric | Target | Frequency |
|--------|--------|-----------|
| Test Coverage | >80% | Per build |
| Pass Rate | >95% | Per run |
| Defect Escape Rate | <5% | Per release |
| Automation Rate | >70% | Quarterly |

### Reports
- Daily: Test execution summary
- Weekly: Defect trends
- Release: Test completion report

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flaky tests | Delayed releases | Quarantine and fix policy |
| Environment issues | Blocked testing | Environment monitoring |
| Resource constraints | Incomplete testing | Risk-based prioritization |

---

## Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| QA Lead | Strategy, planning, reporting |
| QA Engineer | Test execution, automation |
| Developer | Unit tests, bug fixes |
| Product Owner | UAT, acceptance |

---

## References

- [Testing Standards Guide](link)
- [Automation Framework Docs](link)
- [Defect Tracking Process](link)
```

## Quality Criteria

- [ ] All test levels defined
- [ ] Automation strategy documented
- [ ] Tools and frameworks specified
- [ ] Metrics and targets established
- [ ] Roles and responsibilities clear
- [ ] Approved by stakeholders
