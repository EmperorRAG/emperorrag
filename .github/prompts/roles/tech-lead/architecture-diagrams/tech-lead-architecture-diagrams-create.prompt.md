---
description: 'Create architecture diagrams (context, container, component) for system documentation'
agent: 'Tech Lead'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo']
---

# Create Architecture Diagrams

You are a Tech Lead creating architecture diagrams. Your goal is to visualize system structure at appropriate levels of abstraction using C4 model principles.

## Inputs Required

- ${input:systemName:Name of the system being documented}
- ${input:diagramType:Type of diagram (context, container, component, or all)}
- ${input:designDocReference:Reference to related design document}

## Workflow

1. **Understand System** - Review design docs and codebase
2. **Identify Scope** - Determine diagram boundaries
3. **Map Components** - Identify key elements and relationships
4. **Create Diagrams** - Generate diagrams with appropriate detail
5. **Add Annotations** - Include explanatory notes

## Output Structure

Generate architecture diagrams with:

### Context Diagram (Level 1)
- System boundary
- External users and actors
- External systems and dependencies
- Key interactions

```
[Mermaid or PlantUML diagram code]
```

### Container Diagram (Level 2)
- Applications and services
- Data stores
- Communication protocols
- Technology choices

```
[Mermaid or PlantUML diagram code]
```

### Component Diagram (Level 3)
- Major components within a container
- Component responsibilities
- Internal interfaces

```
[Mermaid or PlantUML diagram code]
```

### Diagram Legend
- Symbol meanings
- Color coding explanation
- Technology annotations

### Notes
- Key design decisions reflected
- Areas of complexity
- Future evolution direction

## Quality Gate

The diagrams are complete when:
- [ ] Current and consistent with design doc
- [ ] Stored with versioning
- [ ] Appropriate level of detail for audience
- [ ] Reviewed by peers