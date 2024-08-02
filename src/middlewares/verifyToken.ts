import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly AuthService: AuthService) {}
  /**
   * Middleware para validar se o usuário possui o token.
   *
   * @param {Request} req - O objeto de requisição.
   * @param {Response} res - O objeto da resposta.
   * @param {NextFunction} next - Chama o próximo middleware se tiver.
   * @returns {void}
   * @throws {UnauthorizedException} Se o token for inválido ou ausente retorna uma exceção.
   */
  async use(req: Request, res: Response, next: NextFunction) {
    // Checa se existe a autorização no cabecalho
    if (req.headers.authorization) {
      // Divide o token e o tipo
      const [type, token] = req.headers.authorization.split(' ');

      // Checa se o tipo e bearer e se o token existe
      if (type === 'Bearer' && token !== undefined) {
        // Verifica o token usando o service do modúlo Auth
        try {
          const autenticated = await this.AuthService.verifyToken(token);
          console.log('autenticated', autenticated);

          // Se a verificação do token for bem-sucedida, continue a execução
        } catch (error) {
          // Verifica se o erro é do tipo TokenExpiredError
          if (
            error instanceof TokenExpiredError ||
            error instanceof JsonWebTokenError
          ) {
            throw new UnauthorizedException({
              message: 'Verifique suas credenciais e tente novamente',
              statusCode: 401,
            });
          }
          // Se for outro tipo de erro, re-lança a exceção
          throw error;
        }
        // Se tiver chama o próximo middleware, se não continua a requisição.
        next();
      }
    } else {
      // Lança uma exceção se a autorização estiver ausente
      throw new UnauthorizedException({
        message: 'Verifique suas credenciais e tente novamente',
        statusCode: 401,
      });
    }
  }
}
