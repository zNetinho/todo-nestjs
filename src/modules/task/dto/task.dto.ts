import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiHideProperty()
  id?: string;
  @ApiProperty()
  nome: string;
  @ApiProperty()
  objetivo: string;
  @ApiProperty()
  status?: string;
  @ApiProperty()
  @IsOptional()
  responsavelId?: string;
  @ApiProperty()
  @IsOptional()
  concluido?: boolean;
}
