# Test Plan: Better Auth Utilities Phase 1

## Document Info

- **Version**: 1.0
- **Author**: QA Lead
- **Status**: In Execution
- **Date**: 2026-01-04

---

## Executive Summary

This test plan defines the overall testing approach for Better Auth Utilities Phase 1, covering 16 server operations across OAuth, Session, Account, and User domains. Testing focuses on validating Effect-TS patterns, Schema validation, typed error channels, and Better Auth SDK integration.

---

## Scope

### In Scope

- OAuth domain operations (US-001, US-002, US-003)
- Session domain operations (US-004 through US-010)
- Account domain operations (US-011, US-012, US-013)
- User domain operations (US-014, US-015, US-016)
- Controller input validation (InputError)
- Service SDK integration (ApiError)
- Effect.withSpan tracing
- Schema encode/decode

### Out of Scope

- Client-side operations (Phase 2)
- Real OAuth provider integration (mocked in tests)
- Performance benchmarking (Phase 3)
- Security penetration testing (Phase 3)
- UI testing (library, no UI)

---

## Test Objectives

- [ ] Verify all 16 operations return correctly typed `Effect<Success, Error, AuthServerTag>`
- [ ] Validate Schema.decodeUnknown catches invalid inputs with InputError
- [ ] Confirm API errors propagate as ApiError with status codes
- [ ] Ensure headers parameter correctly passes session cookies
- [ ] Verify Effect.withSpan annotations for tracing
- [ ] Achieve ≥80% code coverage per Test Strategy

---

## Test Strategy

### Test Levels

| Level | Description | Responsibility | Tools |
|-------|-------------|----------------|-------|
| Unit | Controller/Service in isolation | Backend Developer | Vitest + @effect/vitest |
| Integration | Controller → Service → AuthServer | Backend Developer | Vitest + setupServerTestEnvironment |
| Type | TypeScript compilation | Build pipeline | tsc --noEmit |

### Test Types

| Type | Included | Priority | Notes |
|------|----------|----------|-------|
| Functional | Yes | P0 | Core operation functionality |
| Schema Validation | Yes | P0 | Input validation testing |
| Error Handling | Yes | P0 | Tagged error verification |
| Regression | Yes | P0 | Existing Email domain operations |
| Integration | Yes | P1 | Full flow testing |
| Edge Cases | Yes | P1 | Boundary conditions |

---

## Test Environment

### Environment Details

| Environment | Configuration | Purpose |
|-------------|---------------|---------|
| Unit Tests | Mocked AuthServerTag | Controller/Service isolation |
| Integration | setupServerTestEnvironment | Full layer composition |
| CI | Nx Cloud + GitHub Actions | Automated test execution |

### Test Data Requirements

| Data Type | Source | Setup Method |
|-----------|--------|--------------|
| User accounts | In-memory SQLite | Better Auth test setup |
| OAuth providers | Mocked configuration | Test fixtures |
| Session cookies | SignUp flow | setupServerTestEnvironment |

---

## Entry Criteria

- [x] Build Stage artefacts complete (technical-spec, unit-tests, integration-tests)
- [x] Code structure follows ADR-001 Controller-Service-Types pattern
- [x] Command schemas exist for all 16 operations
- [ ] Implementation code complete (pending)
- [ ] Unit tests written (templates defined)

---

## Exit Criteria

- [ ] All P0 test cases executed
- [ ] All P0 test cases passed (100%)
- [ ] P1 test cases executed (≥90% pass rate)
- [ ] No open Critical/High bugs
- [ ] Code coverage ≥80% (line, statement, function)
- [ ] RTM updated with test results
- [ ] Test execution report completed

---

## Test Schedule

| Phase | Start Date | End Date | Deliverable |
|-------|------------|----------|-------------|
| Test Planning | 2026-01-04 | 2026-01-04 | Test Plan approved |
| Test Case Development | 2026-01-04 | 2026-01-05 | Test cases written |
| Test Execution | 2026-01-06 | 2026-01-10 | Tests executed |
| Bug Fixing | 2026-01-06 | 2026-01-12 | Bugs resolved |
| Regression | 2026-01-13 | 2026-01-14 | Regression complete |
| Sign-off | 2026-01-15 | 2026-01-15 | QA sign-off |

---

## Resource Requirements

### Team

| Role | Name | Responsibility |
|------|------|----------------|
| QA Lead | QA Tester | Test planning, execution report |
| Backend Developer | Developer | Implementation, unit tests |
| Tech Lead | Reviewer | Code review, test review |

### Tools

- Test Management: SDLC artefacts (Markdown)
- Test Framework: Vitest + @effect/vitest
- Coverage: V8 via Vitest
- Bug Tracking: SDLC bug-reports.md
- CI/CD: Nx Cloud

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Better Auth SDK API changes | Low | High | Pin SDK version, integration tests |
| Effect-TS version compatibility | Low | Medium | Pin Effect version |
| Complex OAuth flow mocking | Medium | Medium | Use setupServerTestEnvironment |
| Insufficient test data | Low | Low | Generate via factory patterns |

---

## Deliverables

- [x] Test Plan (this document)
- [ ] Test Cases (test-cases.md)
- [ ] RTM Update (rtm-update.md)
- [ ] Test Execution Report (test-execution-report.md)
- [ ] Bug Reports (bug-reports.md)

---

## References

- [Test Strategy](../2-definition/test-strategy.md)
- [Acceptance Criteria](../2-definition/acceptance-criteria.md)
- [User Stories](../3-planning/user-stories.md)
- [RTM](../3-planning/rtm.md)
- [Technical Spec](../5-build/technical-spec.md)
- [Unit Tests Spec](../5-build/unit-tests.md)
- [Integration Tests Spec](../5-build/integration-tests.md)
