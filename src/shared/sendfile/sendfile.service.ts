import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateSendfileDto } from './dto/create-sendfile.dto';
import { UpdateSendfileDto } from './dto/update-sendfile.dto';

@Injectable()
export class SendfileService {
  private readonly supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new BadRequestException('Supabase URL or Key is not set');
    }

    this.supabase = new SupabaseClient(supabaseUrl, supabaseKey);
  }
  create(createSendfileDto: CreateSendfileDto) {
    return 'This action adds a new sendfile';
  }

  // @UseInterceptors(FileInterceptor('file'))

  /**
   * Uploads a file to the specified bucket in Supabase storage.
   *
   * @param {Express.Multer.File} file - The file to be uploaded.
   * @param {string} bucket - The name of the bucket where the file will be uploaded.
   * @returns {Promise<string | void>} - The URL of the uploaded file if successful, otherwise logs the error.
   */
  async upload(file: Express.Multer.File, bucket: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(`${file.originalname}`, file.buffer, {
        upsert: true,
      });
    if (error) {
      throw new BadRequestException('Não foi possível realizar o upload do arquivo, verifique o erro e tente novamente:', error.message)
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
