import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TcpOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigService } from './services/config/config.service';

const serviceName = process.env.npm_package_name;
const serviceVersion = process.env.npm_package_version;

const logger = new Logger(serviceName);
const port = new ConfigService().get('port') || 4002;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: port,
    },
  } as TcpOptions);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen().then(() => {
    logger.log(
      `Microservice ${serviceName}:${port} - ${serviceVersion} running ...`,
    );
  });
}

bootstrap();
