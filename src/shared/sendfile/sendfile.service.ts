import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateSendfileDto } from './dto/create-sendfile.dto';
import { UpdateSendfileDto } from './dto/update-sendfile.dto';

@Injectable()
export class SendfileService {
  constructor() {}

  private readonly supabase = new SupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );
  create(createSendfileDto: CreateSendfileDto) {
    return 'This action adds a new sendfile';
  }

  // @UseInterceptors(FileInterceptor('file'))
  async upload(file: Express.Multer.File) {
    console.log();
    const { data, error } = await this.supabase.storage
      .from('avatars')
      .upload(`${file.originalname}`, file.buffer, {
        upsert: true,
      });
    if (error) {
      console.log(error);
    } else {
      const urlFile = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
      return urlFile;
    }
  }

  findAll() {
    return `This action returns all sendfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sendfile`;
  }

  update(id: number, updateSendfileDto: UpdateSendfileDto) {
    return `This action updates a #${id} sendfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} sendfile`;
  }
}
