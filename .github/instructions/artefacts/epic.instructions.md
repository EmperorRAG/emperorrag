---
description: 'Template and guidelines for Epic'
applyTo: '**/epic/**/*.md, **/epics/**/*.md, **/*-epic.md'
---

# Epic

An epic is a large body of work that can be broken down into user stories and represents a significant business initiative.

## When to Use

- Defining major features or capabilities
- Grouping related user stories
- Planning product roadmap initiatives

## Template

```markdown
# Epic: [Epic Title]

## Epic Summary

### Business Objective
[High-level description of what this epic aims to achieve]

### Strategic Alignment
[How this epic aligns with product vision and business goals]

---

## Scope

### In Scope
- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

### Out of Scope
- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

---

## Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| [KPI 1] | [Baseline] | [Goal] | [How measured] |
| [KPI 2] | [Baseline] | [Goal] | [How measured] |

---

## User Stories

### Must Have (P0)
| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| [ID] | [Story title] | [Est] | [Status] |

### Should Have (P1)
| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| [ID] | [Story title] | [Est] | [Status] |

### Nice to Have (P2)
| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| [ID] | [Story title] | [Est] | [Status] |

---

## Dependencies

### Internal Dependencies
| Dependency | Owner | Impact | Status |
|------------|-------|--------|--------|
| [Dependency] | [Team/Person] | [Impact description] | [Status] |

### External Dependencies
| Dependency | Owner | Impact | Status |
|------------|-------|--------|--------|
| [Dependency] | [Team/Person] | [Impact description] | [Status] |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| [Milestone 1] | [Date] | [Status] |
| [Milestone 2] | [Date] | [Status] |

---

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | [H/M/L] | [H/M/L] | [Strategy] |
| [Risk 2] | [H/M/L] | [H/M/L] | [Strategy] |

---

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | [Name] | [Responsibility] |
| Tech Lead | [Name] | [Responsibility] |
| Design Lead | [Name] | [Responsibility] |
```

## Quality Criteria

- [ ] Clear business objective defined
- [ ] Scope boundaries established
- [ ] Success metrics are measurable
- [ ] User stories identified and prioritized
- [ ] Dependencies mapped
- [ ] Risks assessed with mitigations
