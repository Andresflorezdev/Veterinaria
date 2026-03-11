import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum E2eRunMode {
  FAST = 'fast',
  REAL = 'real',
}

export class RunTestsDto {
  @ApiPropertyOptional({
    description: 'Modo de ejecucion de pruebas e2e',
    enum: E2eRunMode,
    default: E2eRunMode.FAST,
  })
  @IsOptional()
  @IsEnum(E2eRunMode)
  mode?: E2eRunMode;
}