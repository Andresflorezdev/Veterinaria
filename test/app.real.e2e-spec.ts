import { INestApplication } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import request from 'supertest';
import { OwnerModule } from '../src/owner/owner.module';
import { PetModule } from '../src/pet/pet.module';
import { SeedModule } from '../src/seed/seed.module';
import { VeterinarianModule } from '../src/veterinarian/veterinarian.module';

describe('API real (e2e)', () => {
  let app: INestApplication;
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
    const ownerId = ownerResponse.body._id as string;

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
    const vetId = vetResponse.body._id as string;

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
    const petId = petResponse.body._id as string;

    await request(app.getHttpServer())
      .get(`/pet/${petId}/exists`)
      .expect(200)
      .expect({ exists: true });

    const singlePet = await request(app.getHttpServer())
      .get(`/pet/${petId}`)
      .expect(200);
    expect(singlePet.body.owner._id).toBe(ownerId);
    expect(singlePet.body.veterinarian._id).toBe(vetId);

    await request(app.getHttpServer())
      .patch(`/pet/${petId}`)
      .send({ age: 5 })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/pet/${petId}`)
      .expect(200);

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
      .expect((response) => {
        expect(response.body.message).toContain(
          `Owner with ID ${missingId} not found`,
        );
      });
  });

  it('seed crea datos y luego permite limpiar base de datos', async () => {
    const seedFirst = await request(app.getHttpServer()).post('/seed').expect(201);
    expect(seedFirst.body.message).toContain('Seed ejecutado');
    expect(seedFirst.body.data.ownersCreated).toBeGreaterThanOrEqual(0);
    expect(seedFirst.body.data.veterinariansCreated).toBeGreaterThanOrEqual(0);
    expect(seedFirst.body.data.petsCreated).toBeGreaterThanOrEqual(0);

    const seedSecond = await request(app.getHttpServer()).post('/seed').expect(201);
    expect(seedSecond.body.data.ownersCreated).toBe(0);
    expect(seedSecond.body.data.veterinariansCreated).toBe(0);
    expect(seedSecond.body.data.petsCreated).toBe(0);

    await request(app.getHttpServer())
      .delete('/seed')
      .expect(200)
      .expect({ message: 'Base de datos limpiada correctamente' });

    const ownersAfterClear = await request(app.getHttpServer())
      .get('/owner')
      .expect(200);
    expect(ownersAfterClear.body).toHaveLength(0);
  });
});