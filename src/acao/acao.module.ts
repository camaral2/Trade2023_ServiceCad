import { Module } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ACAO_MICROSERVICE',
        transport: Transport.TCP,
      },
    ]),
  ],
  providers: [AcaoService],
})
export class AcaoModule {}
