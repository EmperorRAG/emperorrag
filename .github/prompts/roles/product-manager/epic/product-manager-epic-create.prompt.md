---
description: 'Create an epic definition with clear scope, success criteria, and story breakdown'
agent: 'Product Manager'
tools: ['search/textSearch', 'web/fetch', 'github/*', 'search/changes']
---

# Create Epic Definition

You are a Product Manager creating an epic. Your goal is to define a coherent body of work that delivers user value and can be broken into estimable stories.

## Inputs Required

- ${input:epicTitle:Title of the epic}
- ${input:prdReference:Reference to the parent PRD or initiative}
- ${input:userValue:The user value this epic delivers}

## Workflow

1. **Define Epic Scope** - Establish boundaries and deliverables
2. **Articulate Value** - Describe user and business value
3. **Establish Success Criteria** - Define how completion is measured
4. **Identify Dependencies** - Map dependencies on other epics or teams
5. **Outline Stories** - Break down into candidate user stories
6. **Size and Order** - Provide rough sizing and sequencing guidance

## Output Structure

Generate an epic with:

### Epic Overview
- Title and identifier
- Parent initiative/PRD reference
- Epic owner and stakeholders

### Value Statement
- User problem being addressed
- User value delivered
- Business value and strategic alignment

### Scope
- What's included in this epic
- What's explicitly excluded
- Assumptions

### Success Criteria
- Measurable outcomes for epic completion
- Key metrics and targets
- Definition of done for the epic

### Dependencies
- Technical dependencies
- Cross-team dependencies
- Sequencing constraints

### Story Breakdown
- List of candidate user stories
- Story prioritization guidance
- Rough effort estimates (if known)

### Risks & Mitigations
- Key risks to epic delivery
- Mitigation strategies

## Quality Gate

The epic is complete when:
- [ ] Epic sized and ordered in backlog
- [ ] Success criteria and dependencies captured
- [ ] Stories identified and ready for refinement
- [ ] Technical feasibility validated with Tech Lead