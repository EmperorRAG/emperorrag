# Test Strategy: Better Auth Utilities

**Document Version**: 1.0
**Last Updated**: January 3, 2026
**PRD Reference**: [PRD](./prd.md)
**Owner**: Quality Assurance
**Strategy Owner**: Tech Lead

---

## Overview

### Project/Feature Name

Better Auth Utilities - Server Integration & OAuth Support (Q2 2026)

### Document References

- [Product Vision](../1-discovery/product-vision.md)
- [Product Roadmap](../1-discovery/product-roadmap.md)
- [PRD](./prd.md)
- [Acceptance Criteria](./acceptance-criteria.md)

### Strategy Purpose

Define the testing approach to ensure Better Auth Utilities meets quality standards for type safety, functional correctness, and production readiness. This strategy emphasizes automated testing given the library's pure functional nature.

---

## Scope

### In Scope

| Area | Description |
|------|-------------|
| Server Email Operations | All FR-1 operations (sign-up, sign-in, verify, etc.) |
| Session Management | All FR-2 operations (get, list, revoke) |
| OAuth Operations | All FR-3 operations (sign-in social, callback, link/unlink) |
| Account Management | All FR-4 operations (get info, update, delete) |
| Test Infrastructure | FR-5 mock layers and harness |
| Error Handling | All error types and mapping |
| Type Safety | TypeScript strict mode compilation |
| Effect Patterns | Layer, Context, Schema validation |

### Out of Scope

| Area | Rationale |
|------|-----------|
| UI Testing | No UI components in library |
| Load Testing | Deferred to consuming applications |
| Security Penetration | Handled by Better Auth core |
| Framework Integration | NestJS/Next.js tests in consuming apps |
| Database Adapters | Use Better Auth's tested adapters |

---

## Test Levels

### Unit Testing

**Approach**: Test individual functions in isolation using Effect-TS patterns

**Coverage Targets**:

- Line coverage: >90%
- Branch coverage: >85%
- Function coverage: >95%

**Responsibility**: Backend Software Developer

**Key Focus Areas**:

- Schema validation logic
- Error mapping functions
- Pipeline stage transformations
- Pure utility functions

**Mocking Strategy**:

- Use Effect `Layer.succeed` for mock services
- Mock `AuthServerTag` with controlled responses
- No external network calls in unit tests

**Example Pattern**:

```typescript
describe("mapApiError", () => {
  it("should map network error to ApiError", async () => {
    const result = await runExit(
      mapApiError(new Error("Network failed"))
    );
    expect(Exit.isFailure(result)).toBe(true);
    // Assert error tag
  });
});
```

### Integration Testing

**Approach**: Test service layer with real Better Auth instance using in-memory SQLite

**Coverage Targets**:

- All server operations exercised
- All error paths triggered
- OAuth flows simulated

**Responsibility**: Backend Software Developer

**Key Focus Areas**:

- Service to AuthServer interaction
- Controller orchestration
- Full operation pipelines
- Session lifecycle

**Environment**:

- In-memory SQLite via `setupServerTestEnvironment()`
- Better Auth migrations applied
- Ephemeral HTTP server per test suite

**Example Pattern**:

```typescript
describe("signUpEmailServer integration", () => {
  let env: TestEnvironment;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should create user and return session", async () => {
    const result = await Effect.runPromise(
      signUpEmailServer({ email: "test@test.com", password: "Pass123!" })
        .pipe(Effect.provide(env.authServerLayer))
    );
    expect(result.user.email).toBe("test@test.com");
  });
});
```

### System Testing

**Approach**: Validate complete library API surface and exports

**Coverage Targets**:

- All public exports verified
- Type definitions valid
- Bundle size within limits

**Responsibility**: Tech Lead

**Key Focus Areas**:

- Package.json exports map
- TypeScript declaration files
- Tree-shaking effectiveness
- No circular dependencies

### Acceptance Testing

**Approach**: Verify acceptance criteria from Gherkin scenarios

**Criteria Verification**:

- Map each acceptance criterion to test cases
- Document coverage in RTM
- All "must have" criteria have passing tests

**User Involvement**:

- NestJS microservice team validates integration
- Feedback loop for API ergonomics

---

## Test Types

### Functional Testing

| Test Type | Description | Tool |
|-----------|-------------|------|
| Schema Validation | Verify input validation against Effect Schema | Vitest |
| Operation Tests | Verify each operation returns expected Effect | Vitest |
| Error Mapping | Verify errors map to correct tagged types | Vitest |
| Pipeline Tests | Verify multi-stage pipelines compose correctly | Vitest |

### Type Testing

| Test Type | Description | Tool |
|-----------|-------------|------|
| Strict Compilation | `tsc --noEmit` passes with strict mode | TypeScript |
| API Surface | Public API types are intentional | TypeScript |
| No Any | Zero `any` types in production code | eslint/grep |

### Performance Testing

| Test Type | Description | Tool |
|-----------|-------------|------|
| Operation Latency | Measure overhead vs raw SDK | Vitest + custom timing |
| Bundle Size | Verify <50KB gzipped | size-limit or bundlesize |
| Memory Stability | No leaks in test suite | Node.js --inspect |

### Security Testing

| Test Type | Description | Tool |
|-----------|-------------|------|
| Input Sanitization | Verify malformed inputs rejected | Vitest |
| No Credential Leaks | Verify passwords not in logs/errors | Manual review + grep |
| Dependency Audit | Check for vulnerable dependencies | npm audit |

### Accessibility Testing

**Not Applicable** - Library has no UI components.

---

## Test Environment

### Environment Requirements

| Environment | Purpose | Configuration |
|-------------|---------|---------------|
| Local Dev | Developer testing | Node.js 20.x, in-memory SQLite |
| CI (GitHub Actions) | Automated testing | Node.js 20.x, in-memory SQLite |
| Pre-commit | Quick validation | Unit tests only |

### Test Data Approach

| Data Type | Approach |
|-----------|----------|
| User Data | Generated per test with unique emails |
| Sessions | Created via test setup, cleaned up after |
| OAuth Tokens | Mocked values (no real provider calls) |
| Passwords | Constant test passwords meeting policy |

**Test Data Utilities**:

```typescript
const testUser = () => ({
  email: `test-${Date.now()}@example.com`,
  password: "TestPassword123!",
  name: "Test User"
});
```

### Environment Management

- Each test suite creates isolated environment
- `beforeAll`: Setup test environment
- `afterAll`: Cleanup (close server, release DB)
- No shared state between test files

---

## Tools

### Test Management Tools

| Tool | Purpose |
|------|---------|
| Vitest | Test runner and assertion library |
| GitHub Issues | Defect tracking |
| This Document | Test strategy and planning |

### Automation Frameworks

| Framework | Purpose |
|-----------|---------|
| Vitest | Unit and integration tests |
| Effect Test Harness | Effect-specific testing utilities |
| TypeScript | Type-level testing via compilation |

### Supporting Tools

| Tool | Purpose |
|------|---------|
| @effect/vitest | Effect-TS Vitest integration |
| c8/v8 | Code coverage |
| size-limit | Bundle size monitoring |
| npm audit | Dependency vulnerability scanning |

---

## Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| Tech Lead | Strategy ownership, code review, type testing |
| Backend Software Developer | Unit tests, integration tests, test implementation |
| Backend Software Engineer | Test infrastructure, mock layers |
| Product Manager | Acceptance criteria validation |

---

## Schedule

| Phase | Start | End | Deliverables |
|-------|-------|-----|--------------|
| Strategy Approval | Jan 3, 2026 | Jan 10, 2026 | Approved test strategy |
| Test Infrastructure | Jan 13, 2026 | Jan 31, 2026 | Mock layers, harness updates |
| Unit Test Development | Feb 1, 2026 | Feb 28, 2026 | >90% unit coverage |
| Integration Test Development | Mar 1, 2026 | Mar 31, 2026 | All operations tested |
| Acceptance Testing | Apr 1, 2026 | Apr 15, 2026 | All criteria verified |
| Regression Suite | Apr 16, 2026 | Apr 30, 2026 | Automated regression suite |

---

## Entry and Exit Criteria

### Entry Criteria

| Criterion | Verification |
|-----------|--------------|
| PRD approved | PRD status = Approved |
| Acceptance criteria defined | AC document exists |
| Test environment available | `setupServerTestEnvironment` works |
| Code implemented | Operations exist to test |

### Exit Criteria

| Criterion | Target |
|-----------|--------|
| Unit test coverage | >90% lines |
| Integration tests passing | 100% pass rate |
| Acceptance criteria coverage | 100% criteria have tests |
| No critical defects open | 0 P1/P2 bugs |
| Type compilation | `tsc --noEmit` passes |
| Bundle size | <50KB gzipped |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Flaky async tests | Medium | Medium | Use Effect-TS async primitives properly |
| OAuth mocking complexity | Medium | Low | Create reusable mock providers |
| Test environment setup time | Low | Low | Cache SQLite schema |
| Coverage gaps in edge cases | Medium | Medium | Review AC edge cases explicitly |
| CI timeout on integration tests | Low | Medium | Parallelize test suites |

---

## Defect Management

### Severity Definitions

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Library unusable | All operations throw |
| High | Major feature broken | Sign-in fails |
| Medium | Feature impacted, workaround exists | Error message unclear |
| Low | Minor issue, cosmetic | TSDoc typo |

### Priority Definitions

| Priority | Definition | Response Time |
|----------|------------|---------------|
| P1 | Fix immediately | Same day |
| P2 | Fix in current sprint | Within sprint |
| P3 | Fix in backlog | Within quarter |
| P4 | Nice to have | As capacity allows |

### Defect Workflow

```
New → Triaged → In Progress → In Review → Verified → Closed
                    ↓
                 Blocked → (resolution) → In Progress
```

---

## Existing Test Infrastructure

### Current Assets (from codebase analysis)

| Asset | Location | Status |
|-------|----------|--------|
| Effect Test Harness | `src/lib/test/effectTestHarness.ts` | ✅ Complete |
| Server Test Environment | `src/lib/server/test/setupServerTestEnvironment.ts` | ✅ Complete |
| Example Tests | `src/lib/test/example.node.spec.ts` | ✅ Complete |
| Service Specs | `src/lib/server/core/email/**/*.spec.ts` | Partial |
| Controller Specs | `src/lib/server/core/email/**/*.controller.spec.ts` | Partial |
| Type Specs | `src/lib/server/core/email/**/*.types.spec.ts` | Partial |

### Gaps to Address

| Gap | Action | Priority |
|-----|--------|----------|
| Mock AuthServer Layer | Create `AuthServerMock` | High |
| Mock AuthClient Layer | Create `AuthClientMock` | High |
| OAuth Test Utilities | Create mock OAuth provider | Medium |
| Session Test Helpers | Create session factory | Medium |
| Coverage Reporting | Configure c8/v8 in CI | Medium |

---

## Quality Gate Checklist

- [x] Test scope defined (in/out)
- [x] Test levels documented with approaches
- [x] Test types specified with tools
- [x] Entry/exit criteria established
- [x] Risks identified with mitigations
- [x] Schedule with deliverables
- [x] Roles and responsibilities assigned
- [x] Strategy approved by stakeholders

---

*Previous: [Acceptance Criteria](./acceptance-criteria.md)*
*Next Stage: [Planning](../3-planning/epics.md)*
