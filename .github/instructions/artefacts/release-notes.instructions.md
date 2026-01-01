---
description: 'Template and guidelines for Release Notes'
applyTo: '**/release-notes/**/*.md, **/*-release-notes.md'
---

# Release Notes

Release notes communicate what changed in a release to users, customers, and stakeholders, highlighting new features, improvements, fixes, and known issues.

## When to Use

- Publishing a new version
- Communicating changes to customers
- Documenting changelog for internal teams
- Creating marketing announcements

## Template

```markdown
# Release Notes: [Product Name] [Version]

**Release Date**: [Date]
**Release Type**: [Major / Minor / Patch / Hotfix]

---

## Highlights ✨

> [One to three sentence summary of the most impactful changes in this release]

---

## New Features 🚀

### [Feature Name]

[Brief description of the feature and its value to users]

**How to use**: [Quick getting-started instructions or link to docs]

![Feature Screenshot](path/to/screenshot.png)

---

### [Feature Name]

[Brief description of the feature and its value to users]

**How to use**: [Quick getting-started instructions or link to docs]

---

## Improvements 💪

| Improvement | Description |
|-------------|-------------|
| [Area/Feature] | [What was improved and why it matters] |
| [Area/Feature] | [What was improved and why it matters] |
| [Area/Feature] | [What was improved and why it matters] |

---

## Bug Fixes 🐛

| Issue | Description |
|-------|-------------|
| [Issue ID] | [Brief description of the fix] |
| [Issue ID] | [Brief description of the fix] |
| [Issue ID] | [Brief description of the fix] |

---

## Performance Improvements ⚡

| Area | Improvement |
|------|-------------|
| [Area] | [Metric improvement, e.g., "50% faster page load"] |
| [Area] | [Metric improvement] |

---

## Breaking Changes ⚠️

### [Change Name]

**What changed**: [Description of the breaking change]

**Why**: [Rationale for the change]

**Migration path**:
```typescript
// Before
oldMethod(param);

// After
newMethod({ param });
```

**Affected areas**: [List of affected functionality]

---

## Deprecations 📢

| Feature/API | Deprecated | Removal Version | Alternative |
|-------------|------------|-----------------|-------------|
| [Feature] | This version | [Version] | [Alternative] |

---

## Known Issues 🔍

| Issue | Description | Workaround |
|-------|-------------|------------|
| [Issue ID] | [Description] | [Workaround if available] |
| [Issue ID] | [Description] | [Workaround if available] |

---

## Security Updates 🔒

| Severity | Description | CVE |
|----------|-------------|-----|
| [Critical/High/Medium/Low] | [Brief description] | [CVE ID if applicable] |

---

## Upgrade Instructions

### Prerequisites
- [Prerequisite 1]
- [Prerequisite 2]

### Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Procedure
[Brief instructions for rolling back if needed]

---

## API Changes

### New Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v2/resource` | [Description] |

### Modified Endpoints

| Method | Endpoint | Change |
|--------|----------|--------|
| GET | `/api/v1/resource` | Added `filter` parameter |

### Removed Endpoints

| Method | Endpoint | Alternative |
|--------|----------|-------------|
| GET | `/api/v1/old-endpoint` | Use `/api/v2/new-endpoint` |

---

## Dependency Updates

| Dependency | Previous | New | Notes |
|------------|----------|-----|-------|
| [Package] | [Version] | [Version] | [Notes] |

---

## Contributors

Thank you to everyone who contributed to this release:

- @contributor1
- @contributor2
- @contributor3

---

## Feedback

We'd love to hear your feedback on this release!

- [Create an issue](link)
- [Join our community](link)
- [Contact support](link)

---

## Previous Releases

- [Version X.Y.Z](link) - [Date]
- [Version X.Y.Z](link) - [Date]
```

## Quality Criteria

- [ ] All significant changes documented
- [ ] Clear, user-focused language (not technical jargon)
- [ ] Breaking changes highlighted with migration paths
- [ ] Known issues documented with workarounds
- [ ] Screenshots/examples for new features
- [ ] Upgrade instructions provided
- [ ] Reviewed by product and engineering
