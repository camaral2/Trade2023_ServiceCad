import { Test, TestingModule } from '@nestjs/testing';
import { CompraController } from './compra.controller';
import { CompraService } from './compra.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { AcaoService } from '../acao/acao.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AcaoModule } from '../acao/acao.module';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { ReturnDeleteUpdateDto } from './dto/return-delete-update-compra.dto';

describe('CompraController', () => {
  let controller: CompraController;
  let compraService: CompraService;
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
      ],
      imports: [
        AcaoModule,
        ClientsModule.register([
          { name: 'ACAO_MICROSERVICE', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    controller = moduleRef.get<CompraController>(CompraController);
    compraService = moduleRef.get<CompraService>(CompraService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a new compra', async () => {
      const createDto: CreateCompraDto = {
        acao: 'ACAO',
        user: 'USER',
        valor: 1,
        qtd: 1,
        data: new Date(),
      };
      const compra: Compra = new Compra();
      jest.spyOn(compraService, 'create').mockResolvedValueOnce(compra);

      const result: Compra = await controller.create(createDto);

      expect(compraService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(compra);
    });
  });

  describe('findAll', () => {
    it('should return an array of compras', async () => {
      const user = 'USER';
      const compras: Compra[] = [new Compra()];
      jest.spyOn(compraService, 'findAll').mockResolvedValueOnce(compras);

      const result: Compra[] = await controller.findAll(user);

      expect(compraService.findAll).toHaveBeenCalledWith(user);
      expect(result).toEqual(compras);
    });
  });

  describe('findOne', () => {
    it('should return a compra by id', async () => {
      const id = 'ID';
      const compra: Compra = new Compra();
      jest.spyOn(compraService, 'findOne').mockResolvedValueOnce(compra);

      const result: Compra = await controller.findOne(id);

      expect(compraService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(compra);
    });
  });

  describe('update', () => {
    it('should return the number of affected rows', async () => {
      const id = 'ID';
      const updateDto: UpdateCompraDto = {
        valor: 1,
        qtd: 1,
        valueSale: 0,
        qtdSale: 0,
      };
      const result: ReturnDeleteUpdateDto = { affected: 1 };
      jest.spyOn(compraService, 'update').mockResolvedValueOnce(result);

      const updateResult: ReturnDeleteUpdateDto = await controller.update(
        id,
        updateDto,
      );

      expect(compraService.update).toHaveBeenCalledWith(id, updateDto);
      expect(updateResult).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should return the number of affected rows', async () => {
      const id = 'ID';
      const compareDelete: ReturnDeleteUpdateDto = {
        affected: 1,
      };

      jest.spyOn(compraService, 'remove').mockResolvedValueOnce(compareDelete);

      const deleteResult: ReturnDeleteUpdateDto = await controller.remove(id);

      expect(compraService.remove).toHaveBeenCalledWith(id);
      expect(deleteResult).toEqual(compareDelete);
    });
  });
});
