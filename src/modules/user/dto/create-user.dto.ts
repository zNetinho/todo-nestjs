import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: 'Primeiro nome do usuário' })
  first_name: string;
  @ApiProperty({ description: 'Email do usuário' })
  email: string;
}
