---
description: 'Template and guidelines for Integration Tests'
applyTo: '**/integration-tests/**/*.md, **/*-integration-tests.md, **/*.integration.spec.ts'
---

# Integration Tests

Integration tests verify that multiple components or services work together correctly.

## When to Use

- Testing API endpoints
- Testing database interactions
- Testing service-to-service communication
- Testing middleware chains

## Template

```markdown
# Integration Tests: [Feature/Module Name]

## Test Environment

| Component | Configuration |
|-----------|---------------|
| Database | In-memory / Test container |
| External APIs | Mocked / Stubbed |
| Authentication | Test tokens |
| Environment | Test configuration |

---

## Test Suites

### [API Endpoint / Integration Point]

#### Success Scenarios
| Test | Endpoint | Expected |
|------|----------|----------|
| should create resource | POST /api/resource | 201 Created |
| should fetch resource | GET /api/resource/:id | 200 OK |

#### Error Scenarios
| Test | Endpoint | Expected |
|------|----------|----------|
| should return 404 | GET /api/resource/invalid | 404 Not Found |
| should return 401 | POST /api/resource (no auth) | 401 Unauthorized |

---

## Setup Requirements

- Database seeded with test data
- Auth tokens for test users
- Mock external services configured
```

---

## NestJS Integration Pattern

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ResourceController (integration)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ExternalService)
      .useValue(mockExternalService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup auth token
    authToken = await getTestAuthToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/resources', () => {
    it('should create a resource and return 201', async () => {
      const createDto = {
        name: 'Test Resource',
        description: 'Test description',
      };

      const response = await request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: createDto.name,
        createdAt: expect.any(String),
      });
    });

    it('should return 400 for invalid payload', async () => {
      const invalidDto = { name: '' };

      const response = await request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/resources')
        .send({ name: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/resources/:id', () => {
    let createdId: string;

    beforeEach(async () => {
      // Create a resource for testing
      const res = await request(app.getHttpServer())
        .post('/api/resources')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' });
      createdId = res.body.id;
    });

    it('should return the resource', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/resources/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(createdId);
    });

    it('should return 404 for non-existent resource', async () => {
      await request(app.getHttpServer())
        .get('/api/resources/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
```

---

## Database Integration Pattern

```typescript
import { PrismaClient } from '@prisma/client';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

describe('UserRepository (database integration)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.TEST_DATABASE_URL } },
    });
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany();
  });

  it('should create and retrieve a user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const created = await prisma.user.create({ data: userData });
    const retrieved = await prisma.user.findUnique({
      where: { id: created.id },
    });

    expect(retrieved).toMatchObject(userData);
  });

  it('should enforce unique email constraint', async () => {
    await prisma.user.create({
      data: { email: 'test@example.com', name: 'User 1' },
    });

    await expect(
      prisma.user.create({
        data: { email: 'test@example.com', name: 'User 2' },
      })
    ).rejects.toThrow();
  });
});
```

---

## Test Data Fixtures

```typescript
// fixtures/test-data.ts
export const testUsers = {
  admin: {
    id: 'admin-uuid',
    email: 'admin@test.com',
    role: 'admin',
  },
  user: {
    id: 'user-uuid',
    email: 'user@test.com',
    role: 'user',
  },
};

export async function seedTestData(prisma: PrismaClient) {
  await prisma.user.createMany({ data: Object.values(testUsers) });
}
```

## Quality Criteria

- [ ] Tests isolated from production data
- [ ] Proper setup/teardown for test data
- [ ] External services properly mocked
- [ ] Both success and error scenarios covered
- [ ] Authentication/authorization tested
- [ ] Response schemas validated
