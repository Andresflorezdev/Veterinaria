import { Module } from '@nestjs/common';
import { VeterinarianService } from './veterinarian.service';
import { VeterinarianController } from './veterinarian.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Veterinarian,
  VeterinarianSchema,
} from './entities/veterinarian.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Veterinarian.name, schema: VeterinarianSchema },
    ]),
  ],
  controllers: [VeterinarianController],
  providers: [VeterinarianService],
})
export class VeterinarianModule {}
