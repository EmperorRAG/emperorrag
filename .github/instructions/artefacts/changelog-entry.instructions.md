---
description: 'Template and guidelines for Changelog Entry'
applyTo: '**/changelog-entry/**/*.md, **/changelog/**/*.md, **/*-changelog.md, **/CHANGELOG.md'
---

# Changelog Entry

A changelog entry documents changes in a release following the Keep a Changelog format.

## When to Use

- Documenting feature additions
- Recording bug fixes
- Noting breaking changes
- Tracking deprecations

## Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- [New feature description] ([#PR](link)) - @author

### Changed
- [Changed behavior description] ([#PR](link)) - @author

### Deprecated
- [Deprecated feature] - will be removed in [version]

### Removed
- [Removed feature description] ([#PR](link))

### Fixed
- [Bug fix description] ([#PR](link), fixes [#issue](link)) - @author

### Security
- [Security fix description] ([#PR](link))

---

## [1.2.0] - 2024-01-15

### Added
- New authentication provider for OAuth 2.0 ([#123](link))
- Support for bulk operations in API ([#125](link))
- Dark mode theme support ([#128](link))

### Changed
- Improved error messages for validation failures ([#124](link))
- Updated dependencies to latest versions ([#126](link))
- Refactored database connection pooling ([#127](link))

### Fixed
- Fixed race condition in session handling ([#122](link), fixes [#118](link))
- Corrected timezone handling in date formatting ([#121](link))

### Security
- Patched XSS vulnerability in user input handling ([#130](link))

---

## [1.1.0] - 2024-01-01

### Added
- Initial public release
- Core authentication features
- User management API
- Admin dashboard

[Unreleased]: https://github.com/owner/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/owner/repo/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/owner/repo/releases/tag/v1.1.0
```

---

## Entry Format Guidelines

### Added
For new features that add functionality.
```markdown
- Add user profile image upload support ([#42](link))
- Add API endpoint for bulk user creation ([#45](link))
```

### Changed
For changes in existing functionality.
```markdown
- Update authentication flow to use refresh tokens ([#43](link))
- Improve performance of list queries by 50% ([#46](link))
```

### Deprecated
For features that will be removed in future versions.
```markdown
- Deprecate `legacyAuth` method, use `modernAuth` instead
- Mark old API v1 endpoints as deprecated
```

### Removed
For removed features.
```markdown
- Remove support for Node.js 16 ([#44](link))
- Remove deprecated `oldMethod` function ([#47](link))
```

### Fixed
For bug fixes.
```markdown
- Fix memory leak in connection handler ([#41](link), fixes [#38](link))
- Correct validation error for empty arrays ([#48](link))
```

### Security
For security-related changes.
```markdown
- Fix SQL injection vulnerability in search ([#50](link))
- Update crypto library to patch CVE-2024-XXXX ([#51](link))
```

---

## Conventional Commit Integration

| Commit Type | Changelog Section |
|-------------|-------------------|
| feat: | Added |
| fix: | Fixed |
| docs: | (usually not included) |
| refactor: | Changed |
| perf: | Changed |
| BREAKING CHANGE: | Changed (with ⚠️) |
| security: | Security |
| deprecate: | Deprecated |

## Quality Criteria

- [ ] Changes grouped by type
- [ ] PR/issue links included
- [ ] Version number follows semver
- [ ] Date in ISO format (YYYY-MM-DD)
- [ ] Breaking changes highlighted
- [ ] Comparison links at bottom
