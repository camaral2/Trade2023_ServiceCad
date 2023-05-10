import { Module } from '@nestjs/common';
import { AcaoService } from './acao.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './../services/config/config.service';

@Module({
  providers: [
    AcaoService,
    ConfigService,
    {
      provide: 'ACAO_MICROSERVICE',
      useFactory: (configService: ConfigService) => {
        const mailerServiceOptions = configService.get('acaoService');
        return ClientProxyFactory.create(mailerServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AcaoModule {}
