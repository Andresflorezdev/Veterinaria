import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner, OwnerDocument } from 'src/owner/entities/owner.entity';
import { Pet, PetDocument } from 'src/pet/entities/pet.entity';
import {
  Veterinarian,
  VeterinarianDocument,
} from 'src/veterinarian/entities/veterinarian.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
    @InjectModel(Veterinarian.name)
    private veterinarianModel: Model<VeterinarianDocument>,
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
  ) {}

  async seed(): Promise<any> {
    await this.ownerModel.deleteMany({});
    await this.veterinarianModel.deleteMany({});
    await this.petModel.deleteMany({});

    // Crear 3 dueños
    const owners = await this.ownerModel.insertMany([
      {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '3001234567',
        address: 'Calle 123, Medellín',
      },
      {
        name: 'María González',
        email: 'maria@example.com',
        phone: '3009876543',
        address: 'Carrera 45 #67-89, Medellín',
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        phone: '3005551234',
        address: 'Avenida 80 #12-34, Medellín',
      },
    ]);

    console.log('✅ 3 dueños creados');

    // Crear 3 veterinarios
    const veterinarians = await this.veterinarianModel.insertMany([
      {
        name: 'Dra. María García',
        email: 'maria.garcia@vet.com',
        phone: '3101112233',
        specialty: 'Medicina General',
        licenseNumber: 'VET12345',
      },
      {
        name: 'Dr. Pedro Martínez',
        email: 'pedro.martinez@vet.com',
        phone: '3102223344',
        specialty: 'Cirugía',
        licenseNumber: 'VET67890',
      },
      {
        name: 'Dra. Laura Sánchez',
        email: 'laura.sanchez@vet.com',
        phone: '3103334455',
        specialty: 'Dermatología',
        licenseNumber: 'VET11111',
      },
    ]);

    console.log('✅ 3 veterinarios creados');

    // Crear 3 mascotas
    const pets = await this.petModel.insertMany([
      {
        name: 'Firulais',
        species: 'Perro',
        breed: 'Labrador',
        age: 3,
        owner: owners[0]._id,
        veterinarian: veterinarians[0]._id,
      },
      {
        name: 'Michi',
        species: 'Gato',
        breed: 'Persa',
        age: 2,
        owner: owners[1]._id,
        veterinarian: veterinarians[1]._id,
      },
      {
        name: 'Max',
        species: 'Perro',
        breed: 'Golden Retriever',
        age: 5,
        owner: owners[2]._id,
        veterinarian: veterinarians[2]._id,
      },
    ]);

    console.log('✅ 3 mascotas creadas');

    return {
      message: 'Base de datos inicializada correctamente',
      data: {
        owners: owners.length,
        veterinarians: veterinarians.length,
        pets: pets.length,
      },
    };
  }

  async clear() {
    await this.ownerModel.deleteMany({});
    await this.veterinarianModel.deleteMany({});
    await this.petModel.deleteMany({});

    return {
      mesagge: 'Base de datos limpiada correctamente',
    };
  }
}
