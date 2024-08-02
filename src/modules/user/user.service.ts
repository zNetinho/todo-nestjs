import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMailConsumer } from 'src/queue/job/sendmail-welcome.consumer';
import { UploadFileConsumer } from 'src/queue/job/uploadfile.consumer';
import { SendfileService } from 'src/shared/sendfile/sendfile.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private uploadService: SendfileService,
    private mailService: MailerService,
    private readonly uploadConsumer: UploadFileConsumer,
    private readonly mailSend: SendMailConsumer,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  /**
   * Cria um novo usuário com base nos dados fornecidos.
   * @param {User} user - As propriedades do objeto 'user', first_name, last_name, email, and password.
   * @param {Express.Multer.File} file - O avatar é a imagem enviada pelo usuário.
   * @return {Promise<{message: string, status: HttpStatus, user: {id: string, email: string, avatar: string}}>} - A função devolve uma promise com o resultado da operação.
   * @throws {HttpException} - Se algum dos campos não for passado será lancada uma Exception.
   */
  async create(
    { first_name, last_name, email, password }: User,
    file: Express.Multer.File,
  ): Promise<{
    message: string;
    status: HttpStatus;
    user: { id: string; email: string; avatar: string };
  }> {
    // Check if all required fields are provided
    if (!email || !password || !first_name || !last_name) {
      // If any of the fields are missing, throw an exception
      throw new HttpException(
        'Todos os campos são obrigatórios',
        HttpStatus.BAD_REQUEST,
      );
    }

    const validateData = UserService.validateData({
      first_name,
      last_name,
      email,
      password,
    });
    if (validateData !== true) {
      throw new HttpException(validateData, HttpStatus.BAD_REQUEST);
    }

    try {
      // Generate a salt for password hashing
      const salt = genSaltSync(10);
      // Hash the password using the generated salt
      const hash = hashSync(password, salt);

      // Create a new user in the database
      const data = await this.prisma.user.create({
        data: {
          first_name,
          last_name,
          email,
          password: hash,
        },
      });
      if (data) {
        console.log();
        if (file) {
          this.uploadConsumer.process({
            data: {
              idUser: data.id,
              file: file,
            },
          });
        }
        this.mailSend.process({
          data: {
            first_name: data.first_name,
            email: data.email,
          },
        });
        // Return a success message along with the created user's data
        return {
          message: 'Sucesso ao cadastrar o usuário',
          status: HttpStatus.CREATED,
          user: { id: data.id, email: data.email, avatar: data.avatar },
        };
      }
    } catch (error) {
      console.error(error);
      // If there's an error creating the user, throw an exception
      throw new HttpException(
        'Erro ao criar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  static validateData({ first_name, last_name, email, password }) {
    if (!email || !password || !first_name || !last_name) {
      return 'Todos os campos são obrigatórios';
    }
    return true;
  }

  shouldCreateUser({ first_name, last_name, email, password }) {
    return (
      UserService.validateData({ first_name, last_name, email, password }) ===
      true
    );
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = this.prisma.user.findFirst({ where: { email: email } });
    return user;
  }

  async findAll() {
    const usersCache = await this.cacheService.get('users');
    if (usersCache) {
      return usersCache;
    }
    const users = await this.prisma.user.findMany();
    await this.cacheService.set('users', users, 60 * 1000);
    return users;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user === updateUserDto) {
      return user;
    }
    return `This action updates a #${user.id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
