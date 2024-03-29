import { Inject, Injectable } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { AcaoDto } from './dto/acao.dto';
import { acaoTodayDto } from './dto/acaoToday.dto';
import logger from '../utils/logger';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AcaoService {
  constructor(
    @Inject('ACAO_MICROSERVICE') private readonly acaoClient: ClientTCP,
  ) {}

  async getAcaoToday(acao: acaoTodayDto): Promise<AcaoDto> {
    try {
      logger.log('Run get_acao_today: ' + acao.acao);
      const valRet = await this.acaoClient.send('get_acao_today', acao);

      const ret: AcaoDto = await firstValueFrom(valRet);

      return ret;
    } catch (err) {
      logger.error(`Error: ${err} - [${acao.acao}]`);
      return null;
    }
  }
}
