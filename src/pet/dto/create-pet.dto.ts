/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({
    description: 'Nombre de la mascota',
    example: 'Firulais',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Especie de la mascota',
    example: 'Perro',
    enum: ['Perro', 'Gato', 'Conejo', 'Hamster', 'Otro'],
  })
  @IsString()
  @IsNotEmpty()
  species: string;

  @ApiPropertyOptional({
    description: 'Raza de la mascota',
    example: 'Labrador',
  })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiPropertyOptional({
    description: 'Edad de la mascota en años',
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiProperty({
    description: 'ID del dueño de la mascota',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    description: 'ID del veterinario asignado',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsNotEmpty()
  veterinarian: string;
}
