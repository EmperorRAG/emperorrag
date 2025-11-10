---
post_title: Prisma Better Auth DB Source Summary
author1: EmperorRAG
post_slug: prisma-better-auth-db-source-summary
microsoft_alias: n-a
featured_image: n-a
categories:
	- documentation
tags:
	- prisma
	- better-auth
	- nx
ai_note: Generated with AI assistance
summary: Quick reference for files maintained in the prisma Better Auth database package source directory.
post_date: 2025-11-10
---

# Prisma Better Auth DB Source Overview

The `src` folder holds the TypeScript source for the Prisma-backed Better Auth database package, including entry points, re-export helpers, and generated Prisma client assets.

- **Workspace Path:** `packages/prisma/better-auth-db/src`
- **Project Root Path:** `src`

- [client.ts](./client.ts) — Exposes the Better Auth client instance and shared config for downstream consumers.
- [index.ts](./index.ts) — Re-exports the library barrel so consumers can import from the package root.
- [schemas.ts](./schemas.ts) — Surfaces generated Prisma Zod schemas for external usage.
- [server.ts](./server.ts) — Provides the Better Auth server instance alongside shared configuration.
- [types.ts](./types.ts) — Re-exports aggregated TypeScript types produced by the package.
- [lib/](./lib/) — Contains the Prisma-generated code, Better Auth auth wiring, and supporting library modules.
