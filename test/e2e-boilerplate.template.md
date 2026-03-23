# Plantilla base e2e (Jest + Supertest)

Copia este contenido en un archivo real como:

- `test/resource.e2e-spec.ts` (suite mockeada)
- `test/resource.real.e2e-spec.ts` (suite real con Mongo en memoria)

---

## A) Suite e2e rápida (mockeada)

```ts
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';

import { ResourceController } from '../src/resource/resource.controller';
import { ResourceService } from '../src/resource/resource.service';
esa 
describe('Resource API (e2e mock)', () => {
  let app: INestApplication;

  const resourceServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ResourceController],
      providers: [
        {
          provide: ResourceService,
          useValue: resourceServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /resource creates item', async () => {
    const payload = { name: 'example' };
    const expected = { _id: 'resource-1', ...payload };
    resourceServiceMock.create.mockResolvedValue(expected);

    await request(app.getHttpServer())
      .post('/resource')
      .send(payload)
      .expect(201)
      .expect(expected);
  });

  it('GET /resource/:id returns 404 when not found', async () => {
    resourceServiceMock.findOne.mockRejectedValue(
      new NotFoundException('Resource with ID missing not found'),
    );

    await request(app.getHttpServer())
      .get('/resource/missing')
      .expect(404)
      .expect((response: Response) => {
        const body = response.body as { message: string };
        expect(body.message).toContain('Resource with ID missing not found');
      });
  });
});
```

## B) Suite e2e real (integración)

```ts
import { INestApplication } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';

import { ResourceModule } from '../src/resource/resource.module';

describe('Resource API (e2e real)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoUri), ResourceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<Connection>(getConnectionToken());
    await app.init();
  });

  afterEach(async () => {
    const collections = connection.collections;
    const cleanups = Object.values(collections).map((collection) =>
      collection.deleteMany({}),
    );
    await Promise.all(cleanups);
  });

  afterAll(async () => {
    await app.close();
    await connection.close();
    await mongod.stop();
  });

  it('runs full CRUD flow', async () => {
    const createPayload = { name: 'example' };

    const createResponse = await request(app.getHttpServer())
      .post('/resource')
      .send(createPayload)
      .expect(201);

    const createBody = createResponse.body as { _id: string };

    await request(app.getHttpServer()).get('/resource').expect(200);

    await request(app.getHttpServer())
      .get(`/resource/${createBody._id}`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/resource/${createBody._id}`)
      .send({ name: 'example-updated' })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/resource/${createBody._id}`)
      .expect(200);
  });
});
```
