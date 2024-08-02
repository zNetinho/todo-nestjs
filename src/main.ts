import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('TODO')
    .setDescription('API de tarefas com autenticação e JWT')
    .setContact(
      'Netinho',
      'https://www.linkedin.com/in/antonio-flavio/',
      'netoflavio97@hotmail.com',
    )
    // .addBearerAuth()
    .setVersion('1.0')
    .addTag('task')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: '/swagger.json',
  });
  await app.listen(3000);
}
bootstrap();
