import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from 'src/owner/entities/owner.entity';
// eslint-disable-next-line prettier/prettier
import { Veterinarian, VeterinarianSchema } from 'src/veterinarian/entities/veterinarian.entity';
import { Pet, PetSchema } from 'src/pet/entities/pet.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Owner.name, schema: OwnerSchema },
      { name: Veterinarian.name, schema: VeterinarianSchema },
      { name: Pet.name, schema: PetSchema },
    ]),
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
