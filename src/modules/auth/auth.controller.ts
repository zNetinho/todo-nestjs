import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  /**
   * Sign in a user.
   *
   * @param {User} signInDto - The user object containing the name and password.
   * @return {Promise<any>} A promise that resolves to the result of the sign in operation.
   */
  async signIn(@Body() signInDto: User, @Res() res: Response) {
    const logado = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    if (
      logado instanceof NotFoundException ||
      logado instanceof UnauthorizedException
    ) {
      return res.status(404).json({
        message:
          'Usuário não encontrado, verifique as informações e tente novamente.',
        status: 401,
      });
    }
    console.log(logado);
    return res.status(200).json(logado);
  }
}
