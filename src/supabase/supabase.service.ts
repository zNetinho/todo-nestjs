import { HttpException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

@Injectable()
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient;

  /**
   * Inicializa uma nova classe para utilizar os serviços do supabase.
   *
   * O construtor e chamado passando as seguinte propriedades abaixo para criar uma instancia do supabase:
   * - `supabaseUrl`: The URL of the Supabase instance. This value is retrieved from the `SUPABASE_URL` environment variable.
   * - `supabaseKey`: The API key for the Supabase instance. This value is retrieved from the `SUPABASE_KEY` environment variable.
   * - `supabaseOptions`: An empty object representing additional options for the Supabase instance.
   * - `supabaseJwtSecret`: The JWT secret used for signing and verifying JWT tokens. This value is retrieved from the `SUPABASE_JWT_SECRET` environment variable.
   * - `extractor`: A function used to extract the JWT token from the authorization header of incoming requests.
   *
   */

  constructor() {
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadAvatarInBucket(file: any) {
    try {
      const { data, error } = await this.supabaseClient.storage
        .from('avatars')
        .upload(file.originalname, file.buffer);
      console.log(error);

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException('Falha ao salvar arquivo', 500);
    }
  }
}
