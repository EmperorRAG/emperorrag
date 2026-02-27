# Code Review Checklist: Better Auth Utilities Phase 1

## Overview

| Field | Value |
|-------|-------|
| Project | better-auth-utilities |
| Last Updated | 2025-01-XX |
| Owner | Tech Lead |
| Coding Standards Reference | ADR-001, FP Paradigm Instructions |

---

## Purpose

This checklist ensures consistent code review quality for Phase 1 server operations implementation.

---

## Severity Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| í´´ Critical | Security or data integrity risk | Must fix before merge |
| í¿  High | Significant design issue | Should fix before merge |
| í¿¡ Medium | Code quality concern | Consider fixing |
| í¿¢ Low | Minor suggestion | Optional improvement |

---

## Architecture & Design

### Pattern Compliance

| Check | Severity | Notes |
|-------|----------|-------|
| Follows Controller-Service-Types pattern (ADR-001) | í´´ Critical | Each operation needs all 3 files |
| Uses Effect-TS pipe composition | í´´ Critical | No imperative code in core logic |
| Proper layer/context dependency injection | í¿  High | AuthServerTag usage |
| Value objects for validated data | í¿¡ Medium | UrlSchema, NameSchema, etc. |

### File Organization

| Check | Severity | Notes |
|-------|----------|-------|
| Operation in correct domain folder | í¿  High | oauth/session/account/user |
| Consistent file naming convention | í¿¡ Medium | {operation}.types/service/controller.ts |
| Barrel exports updated | í¿¡ Medium | index.ts files |

---

## Type Safety

### Schema Definitions

| Check | Severity | Notes |
|-------|----------|-------|
| Uses Schema.TaggedClass for params | í´´ Critical | _tag property required |
| Uses Schema.instanceOf(Headers) | í´´ Critical | For headers parameter |
| No `any` types | í´´ Critical | Use unknown + Schema |
| Proper optional field handling | í¿  High | Schema.optional() |

### Error Handling

| Check | Severity | Notes |
|-------|----------|-------|
| Returns Effect with typed error channel | í´´ Critical | Never throws |
| Uses Tagged Errors (InputError, ApiError) | í´´ Critical | Pattern-matchable |
| Error messages are descriptive | í¿¡ Medium | Include context |
| Error cause preserved | í¿¡ Medium | Original error in cause |

---

## Functional Programming

### Effect-TS Patterns

| Check | Severity | Notes |
|-------|----------|-------|
| Pure functions (no side effects) | í´´ Critical | Except at Effect edges |
| Uses pipe() for composition | í¿  High | No nested function calls |
| Effect.flatMap for chaining | í¿  High | Not Effect.map().Effect.flatten() |
| Effect.withSpan for tracing | í¿¡ Medium | All public operations |

### Immutability

| Check | Severity | Notes |
|-------|----------|-------|
| No mutation of parameters | í´´ Critical | Create new objects |
| Const declarations preferred | í¿¡ Medium | No let unless needed |
| No Array.push, Object.assign | í¿¡ Medium | Use spread operators |

---

## Documentation

### TSDoc Comments

| Check | Severity | Notes |
|-------|----------|-------|
| @description for all public functions | í¿  High | What it does |
| @param for each parameter | í¿  High | With type info |
| @returns description | í¿  High | Success and error cases |
| @example with runnable code | í¿¡ Medium | Shows usage |
| @pure annotation for pure functions | í¿¢ Low | Per FP guidelines |

---

## Testing

### Unit Test Coverage

| Check | Severity | Notes |
|-------|----------|-------|
| Controller tested with mock layer | í¿  High | InputError cases |
| Service tested with mock AuthServer | í¿  High | ApiError cases |
| Schema decoding tested | í¿¡ Medium | Valid/invalid inputs |
| Effect success path tested | í´´ Critical | Core functionality |
| Effect error path tested | í´´ Critical | Error handling |

### Test Quality

| Check | Severity | Notes |
|-------|----------|-------|
| Uses @effect/vitest patterns | í¿  High | it.effect() |
| Descriptive test names | í¿¡ Medium | should... when... |
| Isolated test cases | í¿¡ Medium | No shared state |
| Edge cases covered | í¿¡ Medium | Null, empty, boundary |

---

## Performance

| Check | Severity | Notes |
|-------|----------|-------|
| No unnecessary Effect wrapping | í¿¡ Medium | Effect.succeed() for sync |
| Efficient schema decoding | í¿¡ Medium | Parse once |
| No blocking operations | í¿  High | Use Effect.promise |
| Reasonable timeout handling | í¿¢ Low | For network calls |

---

## Security

| Check | Severity | Notes |
|-------|----------|-------|
| No secrets in code | í´´ Critical | Use environment |
| Headers properly forwarded | í´´ Critical | Session cookies |
| Input validated via Schema | í´´ Critical | No raw input usage |
| No sensitive data in logs | ï¿½ï¿½ High | Passwords, tokens |

---

## Approval Criteria

### Required for Merge

- [ ] All í´´ Critical items pass
- [ ] All í¿  High items pass or have documented exceptions
- [ ] Unit tests exist and pass
- [ ] Build succeeds without type errors
- [ ] At least one reviewer approval

### Recommended

- [ ] í¿¡ Medium items addressed
- [ ] Integration tests pass
- [ ] Documentation complete
- [ ] Code coverage > 80%

---

## Review Process

1. **Self-Review**: Author completes checklist before requesting review
2. **Initial Review**: Reviewer checks critical and high items
3. **Detailed Review**: Check medium and low items
4. **Approval**: Confirm all required criteria met
5. **Merge**: Squash and merge with conventional commit

---

## Common Issues to Watch

| Issue | Example | Fix |
|-------|---------|-----|
| Missing _tag | `class Params { }` | Add `_tag: "ParamsName"` |
| Wrong error type | `throw new Error()` | `Effect.fail(new ApiError())` |
| Missing headers | `body: command` only | Add `headers: Headers` |
| Imperative code | `if/else` chains | Use Effect.matchTag or Schema |
| No span | Just service call | Add `Effect.withSpan("op.name")` |

---

## References

- [ADR-001: Controller-Service-Types Pattern](../4-design/adr-001.md)
- [FP Paradigm Instructions](/.github/instructions/fp-paradigm.instructions.md)
- [Effect-TS Documentation](https://effect.website)
- [Better Auth SDK Docs](https://better-auth.com)
