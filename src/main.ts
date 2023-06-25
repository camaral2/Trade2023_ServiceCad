import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { TcpOptions, Transport } from '@nestjs/microservices';
import logger from './utils/logger';

import { AppModule } from './app.module';
import { ConfigService } from './services/config/config.service';

const serviceName = process.env.npm_package_name;
const serviceVersion = process.env.npm_package_version;

const host = new ConfigService().get('host') || 'localhost';
const port = new ConfigService().get('port') || 4002;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  } as TcpOptions);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen().then(() => {
    logger.log(
      `Microservice ${serviceName}(${host}:${port}) - ${serviceVersion} running ...`,
    );
  });
}
bootstrap();
