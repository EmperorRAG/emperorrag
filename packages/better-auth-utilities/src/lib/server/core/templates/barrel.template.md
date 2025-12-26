# Template for barrel export of server-side module

```typescript
/**
 * @file libs/better-auth-utilities/src/lib/server/core/{{path}}/{{camelCase}}/{{camelCase}}.ts
 * @description Barrel export for server-side {{humanReadable}} module.
 *
 * Acceptance Criteria:
 * 1. Must export the controller.
 * 2. Must export the service.
 */

export { {{camelCase}}Controller } from "./{{camelCase}}.controller";
export { {{camelCase}}Service } from "./{{camelCase}}.service";
```
