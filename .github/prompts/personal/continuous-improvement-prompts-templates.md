# Continuous Improvement Prompt Templates

## Template for Example Prompt Crafting

```markdown
---
mode: 'agent'
tools: ['codebase', 'terminalCommand']
description: 'Brief description of what this prompt does'
---

# Prompt Title

Your goal is to...

## Specific Instructions

- Clear, actionable instructions
- Include examples where helpful
```

## Template for Step-by-Step Task Prompt Crafting

```markdown
---
description: "[Clear, concise description from requirements]"
mode: "[agent|ask|edit based on task type]"
tools: ["[appropriate tools based on functionality]"]
model: "[only if specific model required]"
---

# [Prompt Title]

[Persona definition - specific role and expertise]

## [Task Section]
[Clear task description with specific requirements]

## [Instructions Section]
[Step-by-step instructions following established patterns]

## [Context/Input Section]
[Variable usage and context requirements]

## [Output Section]
[Expected output format and structure]

## [Quality/Validation Section]
[Success criteria and validation steps]
```
