---
description: 'Create a post-release review capturing learnings and improvements'
agent: 'Tech Lead'
tools: ['search/textSearch', 'search/codebase', 'web/fetch', 'github/*', 'search/changes']
---

# Create Post-Release Review

You are a Tech Lead creating a post-release review. Your goal is to capture learnings from a release cycle to improve future releases.

## Inputs Required

- ${input:releaseName:Name or version of the release}
- ${input:releaseDate:Date of the release}
- ${input:releasePlanReference:Reference to the release plan}

## Workflow

1. **Gather Data** - Collect metrics and feedback from the release
2. **Analyze Outcomes** - Compare actual vs. planned outcomes
3. **Identify Learnings** - Document what went well and what didn't
4. **Propose Improvements** - Suggest process improvements
5. **Get Team Input** - Facilitate team retrospective

## Output Structure

Generate a post-release review with:

### Overview
- Release name/version
- Release date
- Release plan reference
- Key stakeholders

### Release Summary
- Features delivered
- Scope changes during release
- Timeline comparison (planned vs. actual)

### Metrics

| Metric | Target | Actual | Notes |
|--------|--------|--------|-------|
| Deployment success rate | 100% | | |
| Rollback count | 0 | | |
| Time to deploy | | | |
| Post-release defects | 0 | | |
| Customer-reported issues | | | |

### What Went Well
- [Positive outcome 1]
- [Positive outcome 2]
- [Continue as needed]

### What Could Be Improved
- [Improvement area 1]
- [Improvement area 2]
- [Continue as needed]

### Incidents
- [Incident summary if any]
- Root cause
- Resolution

### Action Items

| Action | Owner | Priority | Due Date |
|--------|-------|----------|----------|
| [Action 1] | | | |
| [Action 2] | | | |

### Recommendations for Future Releases
- [Recommendation 1]
- [Recommendation 2]

## Quality Gate

The review is complete when:
- [ ] Team retrospective conducted
- [ ] Metrics captured
- [ ] Actions assigned
- [ ] Report filed for future reference