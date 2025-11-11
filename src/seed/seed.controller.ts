/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Delete, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({
    summary: 'Inicializar la base de datos de prueba',
    description:
      ' Crea 3 dueños, 3veterinarios y 3 mascotas. ADVERTENCIA: Elimina todos los datos existente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Base de datos inicializada correctamente',
    schema: {
      example: {
        message: 'Base de datos inicializada correctamente',
        data: {
          owners: 3,
          veterinarians: 3,
          pets: 3,
        },
      },
    },
  })
  async executeSeed() {
    return this.seedService.seed();
  }

  @Delete()
  @ApiOperation({
    summary: 'Limpiar toda la base de datos',
    description:
      'Elimina todos los dueños, veterinarios y mascotas. Esta accion no se puede deshaces',
  })
  async clearDatabase() {
    return this.seedService.clear();
  }
}
