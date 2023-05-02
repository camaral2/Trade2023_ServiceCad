import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { Compra } from './entities/compra.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcaoModule } from '../acao/acao.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([Compra]), AcaoModule],
  controllers: [CompraController],
  providers: [CompraService],
})
export class CompraModule {}
