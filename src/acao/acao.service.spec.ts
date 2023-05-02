import { Test, TestingModule } from '@nestjs/testing';
import { AcaoService } from './acao.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AcaoModule } from './acao.module';

describe('AcaoService', () => {
  let service: AcaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcaoService],
      imports: [
        AcaoModule,
        ClientsModule.register([
          { name: 'ACAO_MICROSERVICE', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    service = module.get<AcaoService>(AcaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
