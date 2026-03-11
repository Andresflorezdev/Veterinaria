import { INestApplication } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import request, { Response } from 'supertest';
import { App } from 'supertest/types';
import { OwnerModule } from '../src/owner/owner.module';
import { PetModule } from '../src/pet/pet.module';
import { SeedModule } from '../src/seed/seed.module';
import { VeterinarianModule } from '../src/veterinarian/veterinarian.module';

type IdBody = { _id: string };
type PetDetailsBody = {
  owner: { _id: string };
  veterinarian: { _id: string };
};
type NotFoundBody = { message: string };
type SeedRunBody = {
  message: string;
  data: {
    ownersCreated: number;
    veterinariansCreated: number;
    petsCreated: number;
  };
};

function getIdFromResponse(response: Response): string {
  const body = response.body as unknown as Partial<IdBody>;
  if (typeof body._id !== 'string') {
    throw new Error('Invalid response body: _id is missing');
  }
  return body._id;
}

describe('API real (e2e)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        OwnerModule,
        VeterinarianModule,
        PetModule,
        SeedModule,
      ],
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

  it('ejecuta flujo CRUD completo entre owner, veterinarian y pet', async () => {
    const ownerPayload = {
      name: 'Owner Real',
      email: 'owner.real@example.com',
      phone: '3000000001',
      address: 'Calle 10',
    };
    const ownerResponse = await request(app.getHttpServer())
      .post('/owner')
      .send(ownerPayload)
      .expect(201);
    const ownerId = getIdFromResponse(ownerResponse);

    const vetPayload = {
      name: 'Vet Real',
      email: 'vet.real@example.com',
      phone: '3000000002',
      specialty: 'Medicina General',
      licenseNumber: 'REAL-001',
    };
    const vetResponse = await request(app.getHttpServer())
      .post('/veterinarian')
      .send(vetPayload)
      .expect(201);
    const vetId = getIdFromResponse(vetResponse);

    const petPayload = {
      name: 'Mascota Real',
      species: 'Perro',
      breed: 'Criollo',
      age: 4,
      owner: ownerId,
      veterinarian: vetId,
    };

    const petResponse = await request(app.getHttpServer())
      .post('/pet')
      .send(petPayload)
      .expect(201);
    const petId = getIdFromResponse(petResponse);

    await request(app.getHttpServer())
      .get(`/pet/${petId}/exists`)
      .expect(200)
      .expect({ exists: true });

    const singlePet = await request(app.getHttpServer())
      .get(`/pet/${petId}`)
      .expect(200);
    const singlePetBody = singlePet.body as unknown as PetDetailsBody;
    expect(singlePetBody.owner._id).toBe(ownerId);
    expect(singlePetBody.veterinarian._id).toBe(vetId);

    await request(app.getHttpServer())
      .patch(`/pet/${petId}`)
      .send({ age: 5 })
      .expect(200);

    await request(app.getHttpServer()).delete(`/pet/${petId}`).expect(200);

    await request(app.getHttpServer())
      .get(`/pet/${petId}/exists`)
      .expect(200)
      .expect({ exists: false });
  });

  it('retorna 404 cuando owner no existe', async () => {
    const missingId = '507f1f77bcf86cd799439011';

    await request(app.getHttpServer())
      .get(`/owner/${missingId}`)
      .expect(404)
      .expect((response: Response) => {
        const body = response.body as unknown as NotFoundBody;
        expect(body.message).toContain(`Owner with ID ${missingId} not found`);
      });
  });

  it('seed crea datos y luego permite limpiar base de datos', async () => {
    const seedFirst = await request(app.getHttpServer())
      .post('/seed')
      .expect(201);
    const seedFirstBody = seedFirst.body as unknown as SeedRunBody;
    expect(seedFirstBody.message).toContain('Seed ejecutado');
    expect(seedFirstBody.data.ownersCreated).toBeGreaterThanOrEqual(0);
    expect(seedFirstBody.data.veterinariansCreated).toBeGreaterThanOrEqual(0);
    expect(seedFirstBody.data.petsCreated).toBeGreaterThanOrEqual(0);

    const seedSecond = await request(app.getHttpServer())
      .post('/seed')
      .expect(201);
    const seedSecondBody = seedSecond.body as unknown as SeedRunBody;
    expect(seedSecondBody.data.ownersCreated).toBe(0);
    expect(seedSecondBody.data.veterinariansCreated).toBe(0);
    expect(seedSecondBody.data.petsCreated).toBe(0);

    await request(app.getHttpServer())
      .delete('/seed')
      .expect(200)
      .expect({ message: 'Base de datos limpiada correctamente' });

    const ownersAfterClear = await request(app.getHttpServer())
      .get('/owner')
      .expect(200);
    const ownersBody = ownersAfterClear.body as unknown as unknown[];
    expect(ownersBody).toHaveLength(0);
  });
});
