import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerModule } from './owner/owner.module';
import { VeterinarianModule } from './veterinarian/veterinarian.module';
import { PetModule } from './pet/pet.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/pets-db'),
    OwnerModule,
    VeterinarianModule,
    PetModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
