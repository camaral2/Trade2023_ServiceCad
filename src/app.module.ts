import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcaoModule } from './acao/acao.module';

@Module({
  imports: [AcaoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
