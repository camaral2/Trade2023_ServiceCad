import { Test, TestingModule } from '@nestjs/testing';
import { CompraController } from './compra.controller';
import { CompraService } from './compra.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { AcaoService } from '../acao/acao.service';
import { configAcao } from '../acao/entities/configAcao.entity';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { AcaoModule } from '../acao/acao.module';

describe('CompraController', () => {
  let controller: CompraController;
  //let compraService: CompraService;
  //let app: INestApplication;

  beforeEach(async () => {
    const compraData = {
      acao: 'MGLU3',
      _id: '45325435',
      user: '353245423',
      data: new Date(),
      valor: 0,
      qtd: 0,
      valueSale: 0,
      qtdSale: 0,
      dateSale: new Date(),
      valueSum: 0,
      valueNow: 0,
      dateValue: new Date(),
      saleSum: 0,
      valueAdd: 0,
      percentAdd: 0,
    };
    const comprasRepository = {
      findAll: jest.fn().mockResolvedValue([compraData]),
      find: jest.fn().mockResolvedValue(compraData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CompraController],
      providers: [
        AcaoService,
        CompraService,
        {
          provide: getRepositoryToken(Compra),
          useValue: comprasRepository,
        },
        {
          provide: ClientProxy,
          name: 'AUTH_CLIENT',
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(configAcao),
          useFactory: () => ({
            saveNote: jest.fn(() => []),
            findAllNotes: jest.fn(() => []),
            findOneNote: jest.fn(),
            updateNote: jest.fn(),
            deleteNote: jest.fn(),
          }),
        },
        // {
        //   provide: ConfigService,
        //   useValue: mockedConfigService,
        // },
        // {
        //   provide: JwtService,
        //   useValue: mockedJwtService,
        // },
      ],
      imports: [
        AcaoModule,
        ClientsModule.register([
          { name: 'ACAO_MICROSERVICE', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    controller = moduleRef.get<CompraController>(CompraController);
    //compraService = moduleRef.get<CompraService>(CompraService);

    // app = module.createNestApplication();
    // app.useGlobalPipes(new ValidationPipe());
    // await app.init();
  });

  // afterEach(done => {

  //   serverApp.server.server.close(() => done());
  // });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('and using invalid data', () => {
  //   it('should throw an error', () => {
  //     return request(app.getHttpServer())
  //       .post('/authentication/register')
  //       .send({
  //         name: mockedUser.name
  //       })
  //       .expect(400)
  //   });
  //});
});
