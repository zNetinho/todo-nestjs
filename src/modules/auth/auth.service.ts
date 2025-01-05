import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Asynchronously signs in a user.
   *
   * @param {string} email - The email of the user.
   * @param {string} passwordHash - The hashed password of the user.
   * @returns {Promise<any>} An object containing the signed-in user and a token.
   */
  async signIn(email: string, passwordHash: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return new NotFoundException('User not found');
    }
    if (!compareSync(passwordHash, user.password)) {
      return new UnauthorizedException();
    }
    delete user.password;
    const payload = { sub: user.id, username: user.first_name };
    return {
      user: user,
      token: {
        jwt: await this.jwtService.signAsync(payload),
      },
    };
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
