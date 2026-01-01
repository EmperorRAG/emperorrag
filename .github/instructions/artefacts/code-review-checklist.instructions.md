---
description: 'Template and guidelines for Code Review Checklist'
applyTo: '**/code-review-checklist/**/*.md, **/*-code-review-checklist.md'
---

# Code Review Checklist

A code review checklist establishes agreed criteria for evaluating code changes for quality, maintainability, correctness, and security.

## When to Use

- Standardizing code review process across teams
- Onboarding new reviewers
- Ensuring consistent quality gates
- Documenting team coding standards

## Template

```markdown
# Code Review Checklist: [Project/Team Name]

## Overview

- **Project**: [Project Name]
- **Last Updated**: [Date]
- **Owner**: [Team/Individual]
- **Coding Standards Reference**: [Link]

---

## How to Use This Checklist

1. Review each section relevant to the change
2. Check items that pass, note items that need attention
3. Prioritize critical items over recommended items
4. Provide specific, actionable feedback
5. Approve when all critical items pass

---

## Code Quality

### Correctness (Critical)

- [ ] Code implements the requirements correctly
- [ ] Edge cases are handled appropriately
- [ ] Error handling is comprehensive
- [ ] No obvious bugs or logic errors
- [ ] Null/undefined cases handled
- [ ] Boundary conditions checked

### Maintainability (Critical)

- [ ] Code is readable and self-documenting
- [ ] Functions/methods are appropriately sized (< 50 lines)
- [ ] Naming is clear, consistent, and descriptive
- [ ] No unnecessary complexity
- [ ] Magic numbers replaced with named constants
- [ ] No dead code or commented-out code

### Design (Important)

- [ ] Follows established patterns and conventions
- [ ] Single responsibility principle respected
- [ ] Appropriate abstractions used
- [ ] No code duplication (DRY)
- [ ] Dependencies are appropriate
- [ ] Changes are focused (single concern)

---

## Testing

### Test Coverage (Critical)

- [ ] Unit tests cover critical paths
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases and error scenarios tested
- [ ] Tests are deterministic (no flaky tests)

### Test Quality (Important)

- [ ] Tests are readable and well-organized
- [ ] Test names describe expected behavior
- [ ] Arrange-Act-Assert pattern followed
- [ ] Mocks/stubs used appropriately
- [ ] No test interdependencies

---

## Security

### Input Validation (Critical)

- [ ] All user input validated and sanitized
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevention in place
- [ ] No hardcoded secrets or credentials

### Authentication & Authorization (Critical)

- [ ] Authentication checked where required
- [ ] Authorization enforced appropriately
- [ ] Sensitive operations logged
- [ ] Session handling is secure

### Data Protection (Important)

- [ ] Sensitive data encrypted appropriately
- [ ] PII handled per privacy requirements
- [ ] Secure communication (HTTPS, TLS)
- [ ] No sensitive data in logs

---

## Performance

### Efficiency (Important)

- [ ] No obvious performance issues
- [ ] Database queries are efficient (N+1 avoided)
- [ ] Appropriate caching considered
- [ ] Resource cleanup handled (connections, files)

### Scalability (Recommended)

- [ ] Solution works at expected scale
- [ ] Pagination implemented for large datasets
- [ ] Async operations used appropriately
- [ ] Resource limits considered

---

## Documentation

### Code Documentation (Important)

- [ ] Public APIs documented (JSDoc, etc.)
- [ ] Complex logic explained with comments
- [ ] Non-obvious decisions documented
- [ ] TODO comments have associated issues

### External Documentation (Recommended)

- [ ] README updated if needed
- [ ] API documentation updated
- [ ] CHANGELOG entry added
- [ ] Architecture diagrams updated if needed

---

## Specific Patterns

### [Project-Specific Category]

- [ ] [Project-specific check 1]
- [ ] [Project-specific check 2]
- [ ] [Project-specific check 3]

---

## Review Feedback Guide

### Severity Levels

| Level | Meaning | Action Required |
|-------|---------|-----------------|
| 🔴 Critical | Blocks approval | Must fix |
| 🟡 Important | Should address | Fix or discuss |
| 🟢 Suggestion | Nice to have | Consider |
| 💭 Question | Seeking understanding | Explain |

### Feedback Format

```
[Severity] [Category]: [Specific feedback]
Suggestion: [How to address]
```

---

## Approval Criteria

- [ ] All 🔴 Critical items pass
- [ ] All 🟡 Important items addressed or acknowledged
- [ ] CI/CD checks pass
- [ ] At least one approving review
```

## Quality Criteria

- [ ] Team has agreed on checklist criteria
- [ ] Checklist is practical and not overwhelming
- [ ] Documented and accessible to all team members
- [ ] Reviewed and updated periodically
- [ ] Aligned with coding standards
