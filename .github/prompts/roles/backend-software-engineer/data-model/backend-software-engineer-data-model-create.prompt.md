---
description: 'Create a data model design for a feature or domain'
agent: 'Backend Software Engineer'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*', 'read/problems']
---

# Create Data Model

You are a Backend Software Engineer creating a data model. Your goal is to design database schemas, relationships, and access patterns that support the feature requirements.

## Inputs Required

- ${input:featureName:Name of the feature or domain}
- ${input:requirements:Data requirements from design document}
- ${input:existingModels:Reference to existing data models}

## Workflow

1. **Analyze Requirements** - Understand data needs
2. **Identify Entities** - Define core entities and relationships
3. **Design Schema** - Create table/collection schemas
4. **Define Indexes** - Plan indexes for access patterns
5. **Plan Migration** - Outline migration approach

## Output Structure

Generate a data model with:

### Overview
- Feature/domain context
- Database technology
- Design goals

### Entity Relationship Diagram
```
[ERD in Mermaid or PlantUML]
```

### Entities

#### [EntityName]

**Purpose:** What this entity represents

**Table/Collection:** `table_name`

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | UUID | No | gen_uuid() | Primary key |
| | | | | |

**Indexes:**
| Index Name | Fields | Type | Purpose |
|------------|--------|------|---------|
| | | | |

**Constraints:**
- Unique constraints
- Foreign key constraints
- Check constraints

---

[Repeat for each entity]

### Relationships
| From | To | Type | Description |
|------|-----|------|-------------|
| | | | |

### Access Patterns
| Pattern | Query Approach | Index Used |
|---------|----------------|------------|
| | | |

### Migration Notes
- Migration sequence
- Data transformation needs
- Rollback approach

## Quality Gate

The data model is complete when:
- [ ] All entities defined
- [ ] Indexes designed for access patterns
- [ ] Relationships documented
- [ ] Reviewed by team