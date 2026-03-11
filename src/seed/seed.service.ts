import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { spawn } from 'node:child_process';
import { Owner, OwnerDocument } from '../owner/entities/owner.entity';
import { Pet, PetDocument } from '../pet/entities/pet.entity';
import {
  Veterinarian,
  VeterinarianDocument,
} from '../veterinarian/entities/veterinarian.entity';
import { E2eRunMode } from './dto/run-tests.dto';
import {
  TestExecution,
  TestExecutionDocument,
} from './entities/test-execution.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
    @InjectModel(Veterinarian.name)
    private veterinarianModel: Model<VeterinarianDocument>,
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    @InjectModel(TestExecution.name)
    private testExecutionModel: Model<TestExecutionDocument>,
  ) {}

  async runE2ETests(mode: E2eRunMode): Promise<TestExecution> {
    const script = mode === E2eRunMode.REAL ? 'test:e2e:real' : 'test:e2e';
    const command = `npm run ${script}`;
    const startedAt = new Date();

    const execution = await this.testExecutionModel.create({
      mode,
      status: 'running',
      command,
      startedAt,
      output: '',
      summary: {},
    });

    const runResult = await this.executeNpmScript(script);
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    const status = runResult.exitCode === 0 ? 'passed' : 'failed';
    const summary = this.extractSummary(runResult.output);

    const updatedExecution = await this.testExecutionModel
      .findByIdAndUpdate(
        execution._id,
        {
          status,
          exitCode: runResult.exitCode,
          finishedAt,
          durationMs,
          output: runResult.output,
          summary,
        },
        { new: true },
      )
      .exec();

    if (!updatedExecution) {
      throw new NotFoundException(
        `Execution with ID ${execution._id as unknown as string} not found`,
      );
    }

    return updatedExecution;
  }

  async getE2EHistory(): Promise<TestExecution[]> {
    return this.testExecutionModel
      .find()
      .sort({ startedAt: -1 })
      .limit(20)
      .exec();
  }

  async getE2ERunById(id: string): Promise<TestExecution> {
    const execution = await this.testExecutionModel.findById(id).exec();

    if (!execution) {
      throw new NotFoundException(`Execution with ID ${id} not found`);
    }

    return execution;
  }

  private extractSummary(output: string): {
    testSuites?: string;
    tests?: string;
  } {
    const suitesMatch = output.match(/Test Suites:\s+([^\n\r]+)/);
    const testsMatch = output.match(/Tests:\s+([^\n\r]+)/);

    return {
      testSuites: suitesMatch?.[1],
      tests: testsMatch?.[1],
    };
  }

  private async executeNpmScript(
    script: string,
  ): Promise<{ exitCode: number; output: string }> {
    return new Promise((resolve) => {
      let output = '';

      try {
        const child = spawn(`npm run ${script}`, {
          cwd: process.cwd(),
          stdio: ['ignore', 'pipe', 'pipe'],
          shell: true,
        });

        child.stdout.on('data', (chunk: Buffer | string) => {
          output += chunk.toString();
        });

        child.stderr.on('data', (chunk: Buffer | string) => {
          output += chunk.toString();
        });

        child.on('close', (code) => {
          resolve({
            exitCode: code ?? -1,
            output,
          });
        });

        child.on('error', (error: Error) => {
          resolve({
            exitCode: -1,
            output: `${output}\n${error.message}`,
          });
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        resolve({
          exitCode: -1,
          output: `${output}\n${message}`,
        });
      }
    });
  }

  async seed(): Promise<any> {
    const ownerSeeds = [
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
    ];

    const veterinarianSeeds = [
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
    ];

    const owners: OwnerDocument[] = [];
    const veterinarians: VeterinarianDocument[] = [];
    let ownersCreated = 0;
    let veterinariansCreated = 0;
    let petsCreated = 0;

    for (const ownerSeed of ownerSeeds) {
      let owner = await this.ownerModel.findOne({ email: ownerSeed.email });
      if (!owner) {
        owner = await this.ownerModel.create(ownerSeed);
        ownersCreated += 1;
      }
      owners.push(owner);
    }

    console.log('✅ 3 dueños creados');

    for (const veterinarianSeed of veterinarianSeeds) {
      let veterinarian = await this.veterinarianModel.findOne({
        email: veterinarianSeed.email,
      });
      if (!veterinarian) {
        veterinarian = await this.veterinarianModel.create(veterinarianSeed);
        veterinariansCreated += 1;
      }
      veterinarians.push(veterinarian);
    }

    console.log('✅ 3 veterinarios creados');

    const petSeeds = [
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
    ];

    for (const petSeed of petSeeds) {
      const existingPet = await this.petModel.findOne({
        name: petSeed.name,
        owner: petSeed.owner,
        veterinarian: petSeed.veterinarian,
      });
      if (!existingPet) {
        await this.petModel.create(petSeed);
        petsCreated += 1;
      }
    }

    console.log('✅ 3 mascotas creadas');

    return {
      message: 'Seed ejecutado sin eliminar datos existentes',
      data: {
        ownersCreated,
        veterinariansCreated,
        petsCreated,
      },
    };
  }

  async clear() {
    await this.ownerModel.deleteMany({});
    await this.veterinarianModel.deleteMany({});
    await this.petModel.deleteMany({});

    return {
      message: 'Base de datos limpiada correctamente',
    };
  }
}
