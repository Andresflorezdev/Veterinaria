/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { E2eRunMode } from './dto/run-tests.dto';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({
    summary: 'Inicializar la base de datos de prueba',
    description: ' Crea 3 dueños, 3veterinarios y 3 mascotas.',
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

  @Post('tests/run')
  @ApiOperation({
    summary: 'Ejecutar pruebas e2e rapidas y guardar resultado',
    description:
      'Ejecuta pruebas e2e rapidas y guarda el historial en la coleccion test_executions.',
  })
  @ApiResponse({
    status: 201,
    description: 'Ejecucion finalizada y persistida en MongoDB',
  })
  async runE2ETests() {
    return this.seedService.runE2ETests(E2eRunMode.FAST);
  }

  @Post('tests/run-real')
  @ApiOperation({
    summary: 'Ejecutar pruebas e2e reales y guardar resultado',
    description:
      'Ejecuta pruebas e2e reales (mongodb-memory-server) y guarda el historial en test_executions.',
  })
  @ApiResponse({
    status: 201,
    description: 'Ejecucion real finalizada y persistida en MongoDB',
  })
  async runRealE2ETests() {
    return this.seedService.runE2ETests(E2eRunMode.REAL);
  }

  @Get('tests/history')
  @ApiOperation({
    summary: 'Listar historial de ejecuciones e2e',
    description:
      'Devuelve las ultimas ejecuciones guardadas en test_executions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial retornado correctamente',
  })
  async getE2EHistory() {
    return this.seedService.getE2EHistory();
  }

  @Get('tests/history/:id')
  @ApiOperation({
    summary: 'Obtener detalle de una ejecucion e2e',
    description: 'Consulta por ID una ejecucion guardada en test_executions.',
  })
  @ApiParam({ name: 'id', description: 'ID de la ejecucion' })
  @ApiResponse({ status: 200, description: 'Detalle de ejecucion retornado' })
  @ApiResponse({ status: 404, description: 'Ejecucion no encontrada' })
  async getE2ERunById(@Param('id') id: string) {
    return this.seedService.getE2ERunById(id);
  }
}
