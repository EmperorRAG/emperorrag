# Pull Request: Better Auth Utilities Phase 1

## Metadata

- **PR Title**: feat(better-auth-utilities): implement 16 server operations with Effect-TS
- **Branch**: feature/phase1-server-operations
- **Base Branch**: main
- **Linked Issue**: None (greenfield implementation)

---

## Description

Implements Phase 1 server operations for better-auth-utilities package covering OAuth, Session, Account, and User Management domains using Effect-TS patterns.

### Summary of Changes

| Domain | Operations | Files Added |
|--------|------------|-------------|
| OAuth (E-001) | signInSocial, callbackOAuth, linkSocialAccount | 9 files |
| Session (E-002) | getSession, listSessions, refreshToken, getAccessToken, revokeSession, revokeSessions, revokeOtherSessions | 21 files |
| Account (E-003) | accountInfo, listUserAccounts, unlinkAccount | 9 files |
| User (E-004) | updateUser, deleteUser, deleteUserCallback | 9 files |
| Total | 16 operations | 48 files |

---

## Implementation Details

### Approach

Each operation follows the Controller-Service-Types pattern per ADR-001:
- **Types**: Schema-based params with `Schema.instanceOf(Headers)` for auth
- **Service**: Effect.flatMap(AuthServerTag) → Effect.tryPromise → mapApiError
- **Controller**: Schema.decodeUnknown → mapInputError → service call → Effect.withSpan

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Schema.instanceOf(Headers) | Allows passing web Headers object without serialization |
| Tagged Errors | Type-safe error handling with InputError, ApiError |
| Effect.withSpan | Built-in tracing/telemetry support |
| Value objects | UrlSchema, NameSchema, ImageSchema, PasswordSchema |

### Trade-offs

| Trade-off | Benefit | Cost |
|-----------|---------|------|
| Effect-TS throughout | Type-safe effects, error channel | Steeper learning curve |
| Tagged Schema classes | Self-documenting, pattern-matchable | More boilerplate |
| Separate types/service/controller | Clean separation, testable | Multiple files per operation |

---

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

---

## Related User Stories

| User Story | Description | Status |
|------------|-------------|--------|
| US-001 | Sign in with Social | Implemented |
| US-002 | Handle OAuth Callback | Implemented |
| US-003 | Link Social Account | Implemented |
| US-004 | Get Current Session | Implemented |
| US-005 | List All Sessions | Implemented |
| US-006 | Refresh Session Token | Implemented |
| US-007 | Get Access Token | Implemented |
| US-008 | Revoke Specific Session | Implemented |
| US-009 | Revoke Multiple Sessions | Implemented |
| US-010 | Revoke Other Sessions | Implemented |
| US-011 | Get Account Info | Implemented |
| US-012 | List User Accounts | Implemented |
| US-013 | Unlink Account | Implemented |
| US-014 | Update User | Implemented |
| US-015 | Delete User | Implemented |
| US-016 | Handle Delete Callback | Implemented |

---

## Checklist

### Code Quality

- [x] Code follows project style guidelines (Effect-TS FP paradigm)
- [x] Self-review of code completed
- [x] Comments added for complex logic
- [x] No console.log statements left
- [x] No hardcoded values
- [x] Error handling implemented

### Testing

- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Edge cases covered
- [ ] Test coverage meets threshold (>80%)

### Documentation

- [x] TSDoc comments for all public APIs
- [x] @example tags with runnable examples
- [x] README updated (if needed)
- [x] Changelog updated

### Build

- [ ] Build passes locally (`npx nx build better-auth-utilities`)
- [ ] No type errors (`npx nx typecheck better-auth-utilities`)
- [ ] Linting passes (when configured)

---

## Testing Instructions

```bash
# Build the package
npx nx build better-auth-utilities

# Run unit tests
npx nx test better-auth-utilities

# Run with coverage
npx nx test better-auth-utilities -- --coverage

# Type check
npx nx typecheck better-auth-utilities
```

---

## Deployment Notes

- No database migrations required
- No environment variable changes
- No infrastructure changes
- Package version bump: 0.0.1 → 0.1.0

---

## Breaking Changes

None. This is a new feature addition.

---

## Screenshots/Recordings

N/A - Library package, no UI.

---

## Additional Notes

### File Structure Created

```
src/lib/server/core/
├── oauth/
│   ├── signInSocial/
│   │   ├── signInSocial.types.ts
│   │   ├── signInSocial.service.ts
│   │   └── signInSocial.controller.ts
│   ├── callbackOAuth/
│   └── linkSocialAccount/
├── session/
│   ├── getSession/
│   ├── listSessions/
│   ├── refreshToken/
│   ├── getAccessToken/
│   ├── revokeSession/
│   ├── revokeSessions/
│   └── revokeOtherSessions/
├── account/
│   ├── accountInfo/
│   ├── listUserAccounts/
│   └── unlinkAccount/
└── user/
    ├── updateUser/
    ├── deleteUser/
    └── deleteUserCallback/
```

### Dependencies

- Effect-TS >= 3.0.0
- Better Auth SDK >= 1.0.0
- Existing: AuthServerTag, AuthServerLive layers

---

## Reviewers

- [ ] Tech Lead
- [ ] Backend Engineer
- [ ] QA (integration test review)
