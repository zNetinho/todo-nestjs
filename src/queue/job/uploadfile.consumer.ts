import { OnQueueEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import e from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendfileService } from 'src/shared/sendfile/sendfile.service';

@Processor('uploadfile-queue')
class UploadFileConsumer extends WorkerHost {
  constructor(
    private sendFileService: SendfileService,
    private prisma: PrismaService,
  ) {
    super();
  }

  @OnQueueEvent('active')
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
  async process(job: { data: { idUser: string; file: any; bucket: string } }) {
    const { file, bucket } = job.data;
    const urlFileUploaded = await this.sendFileService.upload(file, bucket);
    return urlFileUploaded;
  }
}

export { UploadFileConsumer };
