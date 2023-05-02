import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const serviceName = process.env.npm_package_name;
const serviceVersion = process.env.npm_package_version;

const logger = new Logger(serviceName);

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}

bootstrap();
logger.log(`Microservice ${serviceName}:${serviceVersion} running`);
