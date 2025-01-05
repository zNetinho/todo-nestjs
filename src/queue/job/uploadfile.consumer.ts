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
  async process(job: any) {
    const { idUser, file } = job.data;
    console.log(job);
    const urlAvatar = await this.sendFileService.upload(file, 'avatars');

    const user = await this.prisma.user.findUnique({
      where: { id: idUser },
    });
    console.log('Usuário:', idUser);

    if (!user) {
      throw new Error(`User with id ${idUser} not found`);
    }
    try {
      await this.prisma.user.update({
        where: {
          id: idUser,
        },
        data: {
          avatar: urlAvatar,
        },
      });
    } catch (error) {
      console.log(error);
    }

    console.log('file', file);
    return 'file uploaded';
  }
}

export { UploadFileConsumer };
