import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVeterinarianDto {
  @ApiProperty({
    description: 'Nombre completo del veterinario',
    example: 'Dra. Maria Garcia',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email del veterinario',
    example: 'maria.garcia@vet.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Numero de telefono del veterinario',
    example: '3254281993',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Especialidad del veterinario',
    example: 'Medicina General',
  })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiPropertyOptional({
    description: 'Numero de licencia profesional',
    example: 'VET12345',
  })
  @IsString()
  @IsOptional()
  licenseNumber?: string;
}
