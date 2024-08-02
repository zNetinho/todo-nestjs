import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class User {
  @ApiHideProperty()
  @IsOptional()
  id: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiHideProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
