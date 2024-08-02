import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('sendmail-welcome')
class SendMailConsumer extends WorkerHost {
  constructor(private mailService: MailerService) {
    super();
  }

  async process(job: any): Promise<any> {
    console.log(job);
    const { email, first_name } = job.data;

    await this.mailService.sendMail({
      to: email,
      subject: 'Bem-vindo',
      text: `Bem-vindo ao to-do app, ${first_name}.`,
    });

    return `message sent to ${email}`;
  }
}

export { SendMailConsumer };
