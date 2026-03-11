import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from '../owner/entities/owner.entity';
// eslint-disable-next-line prettier/prettier
import { Veterinarian, VeterinarianSchema } from '../veterinarian/entities/veterinarian.entity';
import { Pet, PetSchema } from '../pet/entities/pet.entity';
import {
  TestExecution,
  TestExecutionSchema,
} from './entities/test-execution.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Owner.name, schema: OwnerSchema },
      { name: Veterinarian.name, schema: VeterinarianSchema },
      { name: Pet.name, schema: PetSchema },
      { name: TestExecution.name, schema: TestExecutionSchema },
    ]),
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
