import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateSendfileDto } from './dto/update-sendfile.dto';
import { SendfileService } from './sendfile.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Send File')
@Controller('sendfile')
export class SendfileController {
  constructor(private readonly sendfileService: SendfileService) {}

  @Post('upload/user/avatar')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
      { name: 'first_name', maxCount: 1 },
    ]),
  )
  upload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: {
      file?: Express.Multer.File[];
      first_name?: string;
    },
    @Body() body,
  ) {
    try {
      console.log(files, body);
      return {
        body,
        file: files[0].buffer.toString(),
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll() {
    return this.sendfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendfileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSendfileDto: UpdateSendfileDto,
  ) {
    return this.sendfileService.update(+id, updateSendfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendfileService.remove(+id);
  }
}
