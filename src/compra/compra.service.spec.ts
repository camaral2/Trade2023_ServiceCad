import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CompraService } from './compra.service';
import { AcaoService } from '../acao/acao.service';
import { Compra } from './entities/compra.entity';
import { faker } from '@faker-js/faker';
import * as uuid from 'uuid';
import { AcaoDto } from '../acao/dto/acao.dto';
import { util } from '../utils/util';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { ReturnDeleteUpdateDto } from './dto/return-delete-update-compra.dto';

const compraMockNotSales = {
  _id: uuid.v4(),
  data: new Date(),
  acao: faker.company.bsNoun(),
  qtd: 30, // Number(faker.random.numeric(2)),
  user: uuid.v4(),
  valor: 6.8, // Number(faker.commerce.price()),
};

const compraMockSales = {
  _id: uuid.v4(),
  data: new Date(),
  acao: faker.company.bsNoun(),
  qtd: 30, // Number(faker.random.numeric(2)),
  user: uuid.v4(),
  valor: 6.8, // Number(faker.commerce.price()),
  valueSale: 6.9,
};

const compraMockSalesWithQtd = {
  _id: uuid.v4(),
  data: new Date(),
  acao: faker.company.bsNoun(),
  qtd: 30, // Number(faker.random.numeric(2)),
  user: uuid.v4(),
  valor: 6.8, // Number(faker.commerce.price()),
  valueSale: 6.9,
  qtdSale: 20,
};

const acaoMock: AcaoDto = {
  acao: 'MGLU3',
  value: 6.9,
  valueMin: 5.11,
  valueMax: 7.23,
  dataAcao: new Date(),
};

const listCompraMock = [
  { ...compraMockNotSales, compraMockSales, compraMockSalesWithQtd },
];

describe('CompraService', () => {
  let service: CompraService;
  let serviceAcao: AcaoService;
  let compraRepository: Repository<Compra>;

  const mockCompraRepository = () => ({
    find: jest.fn(() => Promise.resolve(listCompraMock)),
    findOne: jest.fn(() => Promise.resolve(compraMockNotSales)),
    save: jest.fn(() => Promise.resolve({})),
    update: jest.fn(() => Promise.resolve({})),
  });

  const mockAcaoService = () => ({
    getAcaoToday: jest.fn(() => Promise.resolve(acaoMock)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcaoService,
        {
          provide: AcaoService,
          useFactory: mockAcaoService,
        },
        CompraService,
        {
          provide: getRepositoryToken(Compra),
          useFactory: mockCompraRepository,
        },
      ],
    }).compile();

    service = module.get<CompraService>(CompraService);
    serviceAcao = module.get<AcaoService>(AcaoService);
    compraRepository = module.get<Repository<Compra>>(
      getRepositoryToken(Compra),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find of compra', () => {
    it('Should return all compra register', async () => {
      const ret = await service.findAll(compraMockNotSales.user);

      expect(compraRepository.find).toBeCalled();
      expect(ret.length).toEqual(listCompraMock.length);
    });

    it('Should return error in findAll', async () => {
      const spyError = jest
        .spyOn(compraRepository, 'find')
        .mockRejectedValue(new Error('erro fake'));

      await expect(service.findAll(compraMockNotSales.user)).rejects.toThrow(
        'erro fake',
      );

      expect(compraRepository.find).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalled();
    });

    it('Should return compra register not sales', async () => {
      const spyCompraNotSales = jest
        .spyOn(serviceAcao, 'getAcaoToday')
        .mockImplementationOnce(() => Promise.resolve(acaoMock));

      const ret = await service.findOne(compraMockNotSales._id);

      expect(compraRepository.findOne).toBeCalled();
      expect(spyCompraNotSales).toBeCalled();

      const totalCompra = util.numero(
        compraMockNotSales.valor * compraMockNotSales.qtd,
        2,
      );
      expect(ret.valueSum).toEqual(totalCompra);

      const totalVenda = util.numero(
        acaoMock.value * compraMockNotSales.qtd,
        2,
      );
      expect(ret.saleSum).toEqual(totalVenda);

      const diferenca = util.numero(totalVenda - totalCompra, 2);
      const percentual = util.numero((diferenca * 100) / totalCompra, 2);
      expect(ret.valueAdd).toEqual(diferenca);
      expect(ret.percentAdd).toEqual(percentual);
    });
  });

  describe('Find a compra', () => {
    it('Should return compra register sales', async () => {
      const spyCompraSales = jest
        .spyOn(compraRepository, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(compraMockSales as Compra),
        );

      const ret = await service.findOne(compraMockNotSales._id);

      expect(compraRepository.findOne).toBeCalled();
      expect(spyCompraSales).toBeCalled();

      const totalCompra = util.numero(
        compraMockNotSales.valor * compraMockNotSales.qtd,
        2,
      );
      expect(ret.valueSum).toEqual(totalCompra);

      const totalVenda = util.numero(
        compraMockSales.valueSale * compraMockNotSales.qtd,
        2,
      );
      expect(ret.saleSum).toEqual(totalVenda);

      //console.dir(ret);
      //console.dir(acaoMock);

      const diferenca = util.numero(totalVenda - totalCompra, 2);
      const percentual = util.numero((diferenca * 100) / totalCompra, 2);
      expect(ret.valueAdd).toEqual(diferenca);
      expect(ret.percentAdd).toEqual(percentual);
    });

    it('Should return compra register sales with qtd', async () => {
      const spyCompraSales = jest
        .spyOn(compraRepository, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(compraMockSalesWithQtd as Compra),
        );

      const ret = await service.findOne(compraMockSalesWithQtd._id);

      expect(compraRepository.findOne).toBeCalled();
      expect(spyCompraSales).toBeCalled();

      const totalCompra = util.numero(
        compraMockSalesWithQtd.valor * compraMockSalesWithQtd.qtd,
        2,
      );
      expect(ret.valueSum).toEqual(totalCompra);

      const totalVenda = util.numero(
        compraMockSalesWithQtd.valueSale * compraMockSalesWithQtd.qtdSale,
        2,
      );
      expect(ret.saleSum).toEqual(totalVenda);

      //console.dir(ret);
      //console.dir(acaoMock);

      const diferenca = util.numero(totalVenda - totalCompra, 2);
      const percentual = util.numero((diferenca * 100) / totalCompra, 2);
      expect(ret.valueAdd).toEqual(diferenca);
      expect(ret.percentAdd).toEqual(percentual);
    });

    it('Should return error in findOne', async () => {
      const spyError = jest
        .spyOn(compraRepository, 'findOne')
        .mockRejectedValue(new Error('erro fake'));

      await expect(service.findOne(compraMockNotSales._id)).rejects.toThrow(
        'erro fake',
      );

      expect(compraRepository.findOne).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalled();
    });
  });

  describe('Manager registers of compra', () => {
    it('Should return a compra created', async () => {
      const spySaveInsert = jest
        .spyOn(compraRepository, 'save')
        .mockImplementationOnce(() =>
          Promise.resolve(compraMockSales as Compra),
        );

      const dataCreate: CreateCompraDto = compraMockSales;
      const ret = await service.create(dataCreate);

      expect(compraRepository.save).toBeCalled();
      expect(spySaveInsert).toHaveBeenCalled();
      expect(ret).toEqual(compraMockSales);
    });

    it('Should return a compra update', async () => {
      const mockUpdateResult: UpdateResult = {
        affected: 1,
        raw: undefined,
        generatedMaps: [],
      };

      const spySaveUpdate = jest
        .spyOn(compraRepository, 'update')
        .mockImplementationOnce(() => Promise.resolve(mockUpdateResult));

      const dataUpdate: UpdateCompraDto = {
        valueSale: compraMockSalesWithQtd.valueSale,
        qtdSale: compraMockSalesWithQtd.qtdSale,
      };

      const ret = await service.update(compraMockSalesWithQtd._id, dataUpdate);

      expect(compraRepository.save).toBeCalled();
      expect(spySaveUpdate).toHaveBeenCalled();

      const compareUpdate: ReturnDeleteUpdateDto = {
        affected: 1,
      };

      expect(ret).toEqual(compareUpdate);
    });
  });
});
