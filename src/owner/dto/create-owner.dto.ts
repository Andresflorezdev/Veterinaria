import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOwnerDto {
  @ApiProperty({
    description: 'Nombre completo del dueño',
    example: 'Juan Perez',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Email del dueño',
    example: 'juan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Numero de telefono del dueño',
    example: '300123456',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    description: 'Direccion del dueño',
    example: 'Calle 123, medellin',
  })
  @IsString()
  @IsOptional()
  address?: string;
}
