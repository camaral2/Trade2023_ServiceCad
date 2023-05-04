import { Test, TestingModule } from '@nestjs/testing';
import { AcaoService } from './acao.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AcaoModule } from './acao.module';
import { acaoTodayDto } from './dto/acaoToday.dto';
import { Observable } from 'rxjs';
import { AcaoDto } from './dto/acao.dto';

describe('AcaoService', () => {
  let service: AcaoService;

  const acaoMock = {
    acao: 'casa',
    value: 1,
    valueMin: 0,
    valueMax: 2,
    dataAcao: new Date(),
  };

  const acao: acaoTodayDto = { acao: 'MGLU3' };

  beforeEach(async () => {
    const dataMockObservable = new Observable((observer) => {
      observer.next(acaoMock);
    });

    dataMockObservable.subscribe();

    const ApiServiceProvider = {
      provide: 'ACAO_MICROSERVICE',
      useFactory: () => ({
        send: jest.fn().mockResolvedValue(dataMockObservable),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AcaoService, ApiServiceProvider],
    }).compile();

    service = module.get<AcaoService>(AcaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const ret = await service.getAcaoToday(acao);
      expect(ret).toEqual(acaoMock);
    });
  });
});
