import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'first_name', maxCount: 1 },
      { name: 'last_name', maxCount: 1 },
      { name: 'avatar', maxCount: 1 },
      { name: 'email', maxCount: 1 },
      { name: 'password', maxCount: 1 },
    ]),
  )
  @Post()
  async create(
    @Body() createUserDto: User,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File;
    },
  ) {
    return this.userService.create(createUserDto, files.avatar[0]);
  }

  @Get()
  @CacheTTL(60)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
