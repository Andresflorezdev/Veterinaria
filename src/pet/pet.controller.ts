/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('pets')
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva mascota' })
  @ApiResponse({ status: 201, description: 'Mascota creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las mascotas con sus respectivos dueños y veterinarios' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas' })
  findAll() {
    return this.petService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mascota por ID con su dueño y veterinario' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota encontrada' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findOne(@Param('id') id: string) {
    return this.petService.findOne(id);
  }

  @Get(':id/exists')
  @ApiOperation({ summary: 'Verificar si existe una mascota' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Resultado de la verificacion' })
  async checkExistis(@Param('id') id: string) {
    const exists = await this.petService.exists(id);
    return { exists };
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar una mascota' })
  @ApiQuery({ name: 'id', description: 'ID de la mascota', required: true })
  @ApiResponse({ status: 200, description: 'Mascota actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Mascota no encontrada' })
  updateByQuery(@Query('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    if (!id) {
      throw new BadRequestException('Debes enviar el query param id con el ID');
    }
    return this.petService.update(id, updatePetDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar una mascota' })
  @ApiQuery({ name: 'pet', description: 'ID de la mascota', required: true })
  @ApiResponse({ status: 200, description: 'Mascota eliminada exitosamente' })
  @ApiResponse({ status: 400, description: 'Mascota no encontrada' })
  async remove(@Query('pet') pet: string) {
    if (!pet) {
      throw new BadRequestException('Debes enviar el query param pet con el ID');
    }
    await this.petService.remove(pet);
    return { message: 'Mascota eliminada' };
  }
}
