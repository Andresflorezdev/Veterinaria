import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { OwnerController } from '../src/owner/owner.controller';
import { OwnerService } from '../src/owner/owner.service';
import { VeterinarianController } from '../src/veterinarian/veterinarian.controller';
import { VeterinarianService } from '../src/veterinarian/veterinarian.service';
import { PetController } from '../src/pet/pet.controller';
import { PetService } from '../src/pet/pet.service';
import { SeedController } from '../src/seed/seed.controller';
import { SeedService } from '../src/seed/seed.service';

describe('API (e2e)', () => {
  let app: INestApplication;

  const ownerServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const veterinarianServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const petServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    exists: jest.fn(),
  };

  const seedServiceMock = {
    seed: jest.fn(),
    clear: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        OwnerController,
        VeterinarianController,
        PetController,
        SeedController,
      ],
      providers: [
        {
          provide: OwnerService,
          useValue: ownerServiceMock,
        },
        {
          provide: VeterinarianService,
          useValue: veterinarianServiceMock,
        },
        {
          provide: PetService,
          useValue: petServiceMock,
        },
        {
          provide: SeedService,
          useValue: seedServiceMock,
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

  describe('Owner endpoints', () => {
    it('POST /owner creates owner', async () => {
      const payload = {
        name: 'Juan Perez',
        email: 'juan@example.com',
        phone: '3001234567',
        address: 'Calle 123',
      };
      const expected = { _id: 'owner-1', ...payload };
      ownerServiceMock.create.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/owner')
        .send(payload)
        .expect(201)
        .expect(expected);
    });

    it('GET /owner returns all owners', async () => {
      const expected = [{ _id: 'owner-1', email: 'juan@example.com' }];
      ownerServiceMock.findAll.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/owner')
        .expect(200)
        .expect(expected);
    });

    it('GET /owner/:id returns one owner', async () => {
      const expected = { _id: 'owner-1', email: 'juan@example.com' };
      ownerServiceMock.findOne.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/owner/owner-1')
        .expect(200)
        .expect(expected);
    });

    it('GET /owner/:id returns 404 when not found', async () => {
      ownerServiceMock.findOne.mockRejectedValue(
        new NotFoundException('Owner with ID missing not found'),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/owner/missing')
        .expect(404)
        .expect((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(response.body.message).toContain(
            'Owner with ID missing not found',
          );
        });
    });

    it('PATCH /owner/:id updates owner', async () => {
      const payload = { phone: '3009990000' };
      const expected = {
        _id: 'owner-1',
        email: 'juan@example.com',
        ...payload,
      };
      ownerServiceMock.update.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .patch('/owner/owner-1')
        .send(payload)
        .expect(200)
        .expect(expected);
    });

    it('DELETE /owner/:id removes owner', async () => {
      const expected = { _id: 'owner-1', email: 'juan@example.com' };
      ownerServiceMock.remove.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .delete('/owner/owner-1')
        .expect(200)
        .expect(expected);
    });
  });

  describe('Veterinarian endpoints', () => {
    it('POST /veterinarian creates veterinarian', async () => {
      const payload = {
        name: 'Dra. Maria Garcia',
        email: 'maria@vet.com',
        phone: '3101112233',
        specialty: 'Medicina General',
        licenseNumber: 'VET12345',
      };
      const expected = { _id: 'vet-1', ...payload };
      veterinarianServiceMock.create.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/veterinarian')
        .send(payload)
        .expect(201)
        .expect(expected);
    });

    it('GET /veterinarian returns all veterinarians', async () => {
      const expected = [{ _id: 'vet-1', email: 'maria@vet.com' }];
      veterinarianServiceMock.findAll.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/veterinarian')
        .expect(200)
        .expect(expected);
    });

    it('GET /veterinarian/:id returns one veterinarian', async () => {
      const expected = { _id: 'vet-1', email: 'maria@vet.com' };
      veterinarianServiceMock.findOne.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/veterinarian/vet-1')
        .expect(200)
        .expect(expected);
    });

    it('GET /veterinarian/:id returns 404 when not found', async () => {
      veterinarianServiceMock.findOne.mockRejectedValue(
        new NotFoundException('Veterinarian with ID missing not found'),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/veterinarian/missing')
        .expect(404)
        .expect((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(response.body.message).toContain(
            'Veterinarian with ID missing not found',
          );
        });
    });

    it('PATCH /veterinarian/:id updates veterinarian', async () => {
      const payload = { specialty: 'Cirugia' };
      const expected = { _id: 'vet-1', email: 'maria@vet.com', ...payload };
      veterinarianServiceMock.update.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .patch('/veterinarian/vet-1')
        .send(payload)
        .expect(200)
        .expect(expected);
    });

    it('DELETE /veterinarian/:id removes veterinarian', async () => {
      const expected = { _id: 'vet-1', email: 'maria@vet.com' };
      veterinarianServiceMock.remove.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .delete('/veterinarian/vet-1')
        .expect(200)
        .expect(expected);
    });
  });

  describe('Pet endpoints', () => {
    it('POST /pet creates pet', async () => {
      const payload = {
        name: 'Firulais',
        species: 'Perro',
        breed: 'Labrador',
        age: 3,
        owner: '507f1f77bcf86cd799439011',
        veterinarian: '507f1f77bcf86cd799439012',
      };
      const expected = { _id: 'pet-1', ...payload };
      petServiceMock.create.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/pet')
        .send(payload)
        .expect(201)
        .expect(expected);
    });

    it('GET /pet returns all pets', async () => {
      const expected = [{ _id: 'pet-1', name: 'Firulais' }];
      petServiceMock.findAll.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/pet')
        .expect(200)
        .expect(expected);
    });

    it('GET /pet/:id returns one pet', async () => {
      const expected = { _id: 'pet-1', name: 'Firulais' };
      petServiceMock.findOne.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/pet/pet-1')
        .expect(200)
        .expect(expected);
    });

    it('GET /pet/:id returns 404 when not found', async () => {
      petServiceMock.findOne.mockRejectedValue(
        new NotFoundException('Pet with ID missing not found'),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/pet/missing')
        .expect(404)
        .expect((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(response.body.message).toContain(
            'Pet with ID missing not found',
          );
        });
    });

    it('GET /pet/:id/exists returns exists=true', async () => {
      petServiceMock.exists.mockResolvedValue(true);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/pet/pet-1/exists')
        .expect(200)
        .expect({ exists: true });
    });

    it('GET /pet/:id/exists returns exists=false', async () => {
      petServiceMock.exists.mockResolvedValue(false);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .get('/pet/pet-2/exists')
        .expect(200)
        .expect({ exists: false });
    });

    it('PATCH /pet/:id updates pet', async () => {
      const payload = { age: 4 };
      const expected = { _id: 'pet-1', name: 'Firulais', ...payload };
      petServiceMock.update.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .patch('/pet/pet-1')
        .send(payload)
        .expect(200)
        .expect(expected);
    });

    it('DELETE /pet/:id removes pet', async () => {
      const expected = { _id: 'pet-1', name: 'Firulais' };
      petServiceMock.remove.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .delete('/pet/pet-1')
        .expect(200)
        .expect(expected);
    });
  });

  describe('Seed endpoints', () => {
    it('POST /seed runs seed process', async () => {
      const expected = {
        message: 'Seed ejecutado sin eliminar datos existentes',
        data: {
          ownersCreated: 3,
          veterinariansCreated: 3,
          petsCreated: 3,
        },
      };
      seedServiceMock.seed.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .post('/seed')
        .expect(201)
        .expect(expected);
    });

    it('DELETE /seed clears database', async () => {
      const expected = { message: 'Base de datos limpiada correctamente' };
      seedServiceMock.clear.mockResolvedValue(expected);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await request(app.getHttpServer())
        .delete('/seed')
        .expect(200)
        .expect(expected);
    });
  });
});
