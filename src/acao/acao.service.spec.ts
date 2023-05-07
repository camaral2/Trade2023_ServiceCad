import { Test, TestingModule } from '@nestjs/testing';
import { AcaoService } from './acao.service';
import { acaoTodayDto } from './dto/acaoToday.dto';
import { Observable } from 'rxjs';
import { AcaoDto } from './dto/acao.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AcaoService', () => {
  let service: AcaoService;
  //let acaoClient: ClientTCP;

  const acaoMock = {
    acao: 'casa',
    value: 1,
    valueMin: 0,
    valueMax: 2,
    dataAcao: new Date(),
  };

  const dataMockObservable = new Observable((observer) => {
    observer.next(acaoMock);
  });

  dataMockObservable.subscribe();

  const mockHttpService = {
    send: jest.fn().mockResolvedValue(dataMockObservable),
  };

  // const ApiServiceProvider = {
  //   provide: 'ACAO_MICROSERVICE',
  //   useFactory: () => ({
  //     send: jest.fn().mockResolvedValue(dataMockObservable),
  //   }),
  // };

  const ApiServiceProvider = {
    provide: 'ACAO_MICROSERVICE',
    useValue: mockHttpService,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcaoService, ApiServiceProvider],
    }).compile();

    service = module.get<AcaoService>(AcaoService);
    //acaoClient = module.get<ClientTCP>(ClientTCP);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('root', () => {
    it('should data of MicroService of Acao"', async () => {
      const acao: acaoTodayDto = { acao: 'MGLU3' };

      const ret: AcaoDto = await service.getAcaoToday(acao);
      expect(ret).toEqual(acaoMock);
      expect(mockHttpService.send).toHaveBeenCalled();
    });

    it('should return error', async () => {
      const acao: acaoTodayDto = { acao: 'MGLU3' };

      const spyError = jest
        .spyOn(mockHttpService, 'send')
        .mockRejectedValue(new Error('erro fake'));

      await expect(service.getAcaoToday(acao)).rejects.toThrow(
        new UnauthorizedException({
          message: 'erro fake',
        }),
      );

      expect(mockHttpService.send).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalled();
    });
  });
});
