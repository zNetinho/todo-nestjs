import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
@Injectable()
class UploadFileService {
  constructor(
    @InjectQueue('uploadfile-queue') private uploadfile_queue: Queue,
  ) {}

  async uploadFile(idUser: string, file: Express.Multer.File) {
    const job = await this.uploadfile_queue.add('uploadfile-job', {
      file,
      idUser,
    });
    console.log(job);
  }
}

export { UploadFileService };
