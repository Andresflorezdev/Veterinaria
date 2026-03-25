/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('owners')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo dueño' })
  @ApiResponse({ status: 201, description: 'Dueño creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownerService.create(createOwnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los dueños' })
  @ApiResponse({ status: 400, description: 'Lista de dueños' })
  findAll() {
    return this.ownerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un dueño por ID' })
  @ApiParam({ name: 'id', description: 'ID del dueño' })
  @ApiResponse({ status: 200, description: 'Dueño encontrado' })
  @ApiResponse({ status: 400, description: 'Dueño no encontrado' })
  findOne(@Param('id') id: string) {
    return this.ownerService.findOne(id);
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar un dueño' })
  @ApiQuery({name: 'id', description: 'ID del dueño', required: true })
  @ApiResponse({ status: 200, description: 'Dueño actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Dueño no encontrado' })
  updateByQuery(@Query('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    if (!id) {
      throw new BadRequestException('Debes enviar el query param id con el ID');
    }
    return this.ownerService.update(id, updateOwnerDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar un dueño' })
  @ApiQuery({name: 'owner', description: 'ID del dueño', required: true })
  @ApiResponse({ status: 200, description: 'Dueño eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Dueño no encontrado' })
  async remove(@Query('owner') owner: string) {
    if (!owner) {
      throw new BadRequestException('Debes enviar el query param owner con el ID');
    }
    await this.ownerService.remove(owner);
    return { message: 'Dueño eliminado' };
  }
}
