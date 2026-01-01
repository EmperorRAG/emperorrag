---
description: 'Create a code review checklist defining quality criteria for code reviews'
mode: 'agent'
tools: ['search', 'codebase', 'fetch', 'githubRepo']
---

# Create Code Review Checklist

You are a Tech Lead creating a code review checklist. Your goal is to establish agreed criteria for evaluating code changes for quality, maintainability, and correctness.

## Inputs Required

- ${input:projectContext:Project or team context}
- ${input:focusAreas:Specific focus areas (security, performance, etc.)}
- ${input:existingStandards:Reference to existing coding standards}

## Workflow

1. **Gather Standards** - Review existing coding standards and guidelines
2. **Identify Categories** - Define review categories
3. **Create Criteria** - Establish specific checkpoints
4. **Prioritize** - Mark critical vs. recommended items
5. **Get Adoption** - Obtain team agreement

## Output Structure

Generate a code review checklist with:

### Purpose
- Goals of code review
- How to use this checklist

### Code Quality

#### Correctness
- [ ] Code implements the requirements correctly
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs or logic errors

#### Maintainability
- [ ] Code is readable and self-documenting
- [ ] Functions/methods are appropriately sized
- [ ] Naming is clear and consistent
- [ ] No unnecessary complexity

#### Design
- [ ] Follows established patterns and conventions
- [ ] Single responsibility principle respected
- [ ] Appropriate abstractions used
- [ ] No code duplication

### Testing

- [ ] Unit tests cover critical paths
- [ ] Tests are meaningful (not just for coverage)
- [ ] Edge cases tested
- [ ] Tests are maintainable

### Security

- [ ] Input validation is present
- [ ] No hardcoded secrets
- [ ] Authentication/authorization checked
- [ ] Sensitive data handled appropriately

### Performance

- [ ] No obvious performance issues
- [ ] Database queries are efficient
- [ ] Appropriate caching considered
- [ ] Resource cleanup handled

### Documentation

- [ ] Public APIs documented
- [ ] Complex logic explained
- [ ] README updated if needed
- [ ] Changelog updated

### Standards Compliance

- [ ] Follows project coding standards
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Consistent formatting

### Review Process

- How to provide feedback
- When to approve vs. request changes
- Escalation process for disagreements

## Quality Gate

The checklist is complete when:
- [ ] Adopted by the team
- [ ] Covers key quality dimensions
- [ ] Practical and actionable
- [ ] Scheduled for periodic refinement