/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeterinarianService } from './veterinarian.service';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('veterinarians')
@Controller('veterinarian')
export class VeterinarianController {
  constructor(private readonly veterinarianService: VeterinarianService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo veterinario' })
  @ApiResponse({ status: 201, description: 'Veterinario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  create(@Body() createVeterinarianDto: CreateVeterinarianDto) {
    return this.veterinarianService.create(createVeterinarianDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los veterinarios' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarios' })
  findAll() {
    return this.veterinarianService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un veterinario por ID' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Veterinario encontrado' })
  @ApiResponse({ status: 400, description: 'Veterinario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.veterinarianService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un veterinario' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Veterinario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Veterinario no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateVeterinarianDto: UpdateVeterinarianDto,
  ) {
    return this.veterinarianService.update(id, updateVeterinarianDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un veterinario' })
  @ApiParam({ name: 'id', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Veterinario eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'Veterinario no encontrado' })
  remove(@Param('id') id: string) {
    return this.veterinarianService.remove(id);
  }
}
