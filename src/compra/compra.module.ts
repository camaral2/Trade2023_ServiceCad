import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { Compra } from './entities/compra.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcaoModule } from '../acao/acao.module';
import { AcaoService } from '../acao/acao.service';
import { ConfigService } from '../services/config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([Compra]), AcaoModule],
  controllers: [CompraController],
  providers: [
    CompraService,
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
export class CompraModule {}
