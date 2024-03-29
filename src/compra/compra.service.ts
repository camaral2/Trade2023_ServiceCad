//https://github.com/rizama/marketplace-api-search/blob/main/src/jaknot/jaknot.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import logger from '../utils/logger';
import { DeleteResult, ObjectId, Repository, UpdateResult } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';
import { AcaoService } from '../acao/acao.service';
import { AcaoDto } from '../acao/dto/acao.dto';
import * as uuid from 'uuid';
import { ReturnDeleteUpdateDto } from './dto/return-delete-update-compra.dto';
import { acaoTodayDto } from '../acao/dto/acaoToday.dto';
import { util } from '../utils/util';
import { SetSaleCompraDto } from './dto/set-sale-compra.dto';

@Injectable()
export class CompraService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    private readonly acaoService: AcaoService,
  ) {}
  async processMessage(data: any): Promise<any> {
    // Process the message
    // Example: Log the message and return a response
    console.log('Received message:', data);
    return { message: 'Message processed successfully' };
  }
  async findAll(userFilter: string, acaoFilter: string): Promise<Compra[]> {
    try {
      const arr = await this.compraRepository.find({
        where: { user: userFilter, acao: acaoFilter },
      });

      logger.log(
        `Acoes register of user:(${arr.length}) - filter:(${userFilter}/${acaoFilter})`,
      );

      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        await this.prepareRegister(element);
      }
      return arr;
    } catch (err) {
      logger.error(`Error: ${err} - [${userFilter}]`);
      throw err;
    }
  }

  async findOne(id: string): Promise<Compra> {
    try {
      if (!id || id == undefined) throw new BadRequestException('id is empty');

      const compra = await this.compraRepository.findOne({
        where: { _id: id },
      });
      if (!compra) throw new NotFoundException(`Id not found: (${id})`);

      return await this.prepareRegister(compra);
    } catch (err) {
      logger.error(`Error: ${err} - [findOne: ${id}]`);
      throw err;
    }
  }

  private async prepareRegister(dataOld: Compra): Promise<Compra> {
    logger.log(`--------------------------`);
    logger.log(
      `prepareRegister - dataOld.valueNow:(${dataOld.valueNow}) - dataOld.valueSale:(${dataOld.valueSale})`,
    );

    if (!(dataOld.valueNow > 0) && !(dataOld.valueSale > 0)) {
      const acaoToday: acaoTodayDto = { acao: dataOld.acao };
      const ret: AcaoDto = await this.acaoService.getAcaoToday(acaoToday);

      if (ret) {
        dataOld.valueNow = ret.value;
        dataOld.dateValue = ret.dataAcao;
      }
    }

    if (dataOld.valueNow > 0) {
      dataOld = await this.setValues(dataOld.valueNow, dataOld);
    } else {
      dataOld = await this.setValues(dataOld.valueSale, dataOld);
    }

    logger.log(
      `Valor retorno - valueNow:${dataOld.valueNow} / valueSale:${dataOld.valueSale} / valor:${dataOld.valor}`,
    );

    return dataOld;
  }

  private async setValues(value: number, dataEntity: Compra): Promise<Compra> {
    if (dataEntity.qtdSale > 0) {
      dataEntity.saleSum = util.numero(value * dataEntity.qtdSale, 2);
      dataEntity.valueSum = util.numero(dataEntity.valor * dataEntity.qtd, 2);
    } else {
      dataEntity.saleSum = util.numero(value * dataEntity.qtd, 2);
      dataEntity.valueSum = util.numero(dataEntity.valor * dataEntity.qtd, 2);
    }

    dataEntity.valueAdd = util.numero(
      dataEntity.saleSum - dataEntity.valueSum,
      2,
    );

    //console.log('dataEntity.valueSum:', dataEntity.valueSum);
    //console.log('dataEntity.saleSum:', dataEntity.saleSum);

    const percentAdd = util.percent(dataEntity.valueSum, dataEntity.saleSum, 2);
    dataEntity.percentAdd = percentAdd;

    //console.log('dataEntity.percentAdd:', dataEntity.percentAdd);

    return dataEntity;
  }

  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    const { acao, user, valor, qtd, data } = createCompraDto;

    const compra = new Compra();

    compra._id = uuid.v4();
    compra.acao = acao;
    compra.user = user;
    compra.valor = valor;
    compra.qtd = qtd;
    compra.data = data;

    const ret = await this.compraRepository.save(compra);
    return ret;
  }

  async update(
    id: string,
    updateCompraDto: UpdateCompraDto,
  ): Promise<ReturnDeleteUpdateDto> {
    try {
      logger.log(`update this compra - id:${id}`);

      const ret: UpdateResult = await this.compraRepository.update(
        { _id: id },
        updateCompraDto,
      );

      return { affected: ret.affected };
    } catch (err) {
      logger.error(`Error update: ${err} - [id: ${id}]`);
      throw err;
    }
  }

  async setVenda(
    id: string,
    requestSale: SetSaleCompraDto,
  ): Promise<ReturnDeleteUpdateDto> {
    try {
      logger.log(`Set venda this compra - id:${id}`);

      const ret: UpdateResult = await this.compraRepository.update(
        { _id: id },
        requestSale,
      );

      return { affected: ret.affected };
    } catch (err) {
      logger.error(`Error setVenda: ${err} - [id: ${id}]`);
      throw err;
    }
  }

  async remove(id: string): Promise<ReturnDeleteUpdateDto> {
    logger.log(`delete this compra - id:${id}`);
    const ret: DeleteResult = await this.compraRepository.delete({ _id: id });
    return { affected: ret.affected };
  }
}
