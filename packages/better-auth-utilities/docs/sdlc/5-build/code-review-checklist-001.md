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
| ��� Critical | Security or data integrity risk | Must fix before merge |
| ��� High | Significant design issue | Should fix before merge |
| ��� Medium | Code quality concern | Consider fixing |
| ��� Low | Minor suggestion | Optional improvement |

---

## Architecture & Design

### Pattern Compliance

| Check | Severity | Notes |
|-------|----------|-------|
| Follows Controller-Service-Types pattern (ADR-001) | ��� Critical | Each operation needs all 3 files |
| Uses Effect-TS pipe composition | ��� Critical | No imperative code in core logic |
| Proper layer/context dependency injection | ��� High | AuthServerTag usage |
| Value objects for validated data | ��� Medium | UrlSchema, NameSchema, etc. |

### File Organization

| Check | Severity | Notes |
|-------|----------|-------|
| Operation in correct domain folder | ��� High | oauth/session/account/user |
| Consistent file naming convention | ��� Medium | {operation}.types/service/controller.ts |
| Barrel exports updated | ��� Medium | index.ts files |

---

## Type Safety

### Schema Definitions

| Check | Severity | Notes |
|-------|----------|-------|
| Uses Schema.TaggedClass for params | ��� Critical | _tag property required |
| Uses Schema.instanceOf(Headers) | ��� Critical | For headers parameter |
| No `any` types | ��� Critical | Use unknown + Schema |
| Proper optional field handling | ��� High | Schema.optional() |

### Error Handling

| Check | Severity | Notes |
|-------|----------|-------|
| Returns Effect with typed error channel | ��� Critical | Never throws |
| Uses Tagged Errors (InputError, ApiError) | ��� Critical | Pattern-matchable |
| Error messages are descriptive | ��� Medium | Include context |
| Error cause preserved | ��� Medium | Original error in cause |

---

## Functional Programming

### Effect-TS Patterns

| Check | Severity | Notes |
|-------|----------|-------|
| Pure functions (no side effects) | ��� Critical | Except at Effect edges |
| Uses pipe() for composition | ��� High | No nested function calls |
| Effect.flatMap for chaining | ��� High | Not Effect.map().Effect.flatten() |
| Effect.withSpan for tracing | ��� Medium | All public operations |

### Immutability

| Check | Severity | Notes |
|-------|----------|-------|
| No mutation of parameters | ��� Critical | Create new objects |
| Const declarations preferred | ��� Medium | No let unless needed |
| No Array.push, Object.assign | ��� Medium | Use spread operators |

---

## Documentation

### TSDoc Comments

| Check | Severity | Notes |
|-------|----------|-------|
| @description for all public functions | ��� High | What it does |
| @param for each parameter | ��� High | With type info |
| @returns description | ��� High | Success and error cases |
| @example with runnable code | ��� Medium | Shows usage |
| @pure annotation for pure functions | ��� Low | Per FP guidelines |

---

## Testing

### Unit Test Coverage

| Check | Severity | Notes |
|-------|----------|-------|
| Controller tested with mock layer | ��� High | InputError cases |
| Service tested with mock AuthServer | ��� High | ApiError cases |
| Schema decoding tested | ��� Medium | Valid/invalid inputs |
| Effect success path tested | ��� Critical | Core functionality |
| Effect error path tested | ��� Critical | Error handling |

### Test Quality

| Check | Severity | Notes |
|-------|----------|-------|
| Uses @effect/vitest patterns | ��� High | it.effect() |
| Descriptive test names | ��� Medium | should... when... |
| Isolated test cases | ��� Medium | No shared state |
| Edge cases covered | ��� Medium | Null, empty, boundary |

---

## Performance

| Check | Severity | Notes |
|-------|----------|-------|
| No unnecessary Effect wrapping | ��� Medium | Effect.succeed() for sync |
| Efficient schema decoding | ��� Medium | Parse once |
| No blocking operations | ��� High | Use Effect.promise |
| Reasonable timeout handling | ��� Low | For network calls |

---

## Security

| Check | Severity | Notes |
|-------|----------|-------|
| No secrets in code | ��� Critical | Use environment |
| Headers properly forwarded | ��� Critical | Session cookies |
| Input validated via Schema | ��� Critical | No raw input usage |
| No sensitive data in logs | �� High | Passwords, tokens |

---

## Approval Criteria

### Required for Merge

- [ ] All ��� Critical items pass
- [ ] All ��� High items pass or have documented exceptions
- [ ] Unit tests exist and pass
- [ ] Build succeeds without type errors
- [ ] At least one reviewer approval

### Recommended

- [ ] ��� Medium items addressed
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

- [ADR-001: Controller-Service-Types Pattern](../../adr/adr-001-controller-service-architecture.md)
- [FP Paradigm Instructions](/.github/instructions/fp-paradigm.instructions.md)
- [Effect-TS Documentation](https://effect.website)
- [Better Auth SDK Docs](https://better-auth.com)
