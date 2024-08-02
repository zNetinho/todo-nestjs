import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
class SendmailProducerService {
  constructor(@InjectQueue('sendmail-welcome') private sendmail_queue: Queue) {}

  async sendWelcomeEmail(email: string) {
    await this.sendmail_queue.add('sendmail-welcome-job', { email });
  }
}

export { SendmailProducerService };
