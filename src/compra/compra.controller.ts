import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ReturnDeleteUpdateDto } from './dto/return-delete-update-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';
import { MessagePattern } from '@nestjs/microservices';
import logger from '../utils/logger';
import { GetCompraDto } from './dto/get-compra.dto';
import { CompraRequestDto } from './dto/compra-request.dto';

@UsePipes(new ValidationPipe())
@Controller('compras')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @MessagePattern('compra_create')
  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    return await this.compraService.create(createCompraDto);
  }

  @MessagePattern('compra_findAll')
  async findAll(filter: GetCompraDto): Promise<Compra[]> {
    const ret = await this.compraService.findAll(filter.user, filter.acao);

    logger.log(
      `Acoes register of user:(${ret.length}) - filter:(${filter.user}/${filter.acao})`,
    );

    return ret;
  }

  @MessagePattern('compra_findOne')
  async findOne(id: string): Promise<Compra> {
    return await this.compraService.findOne(id);
  }

  @MessagePattern('compra_update')
  async update(data: CompraRequestDto): Promise<ReturnDeleteUpdateDto> {
    return await this.compraService.update(data.id, data.compra);
  }

  @MessagePattern('compra_venda')
  async setVenda(data: CompraRequestDto): Promise<ReturnDeleteUpdateDto> {
    return await this.compraService.setVenda(data.id, data.compra);
  }

  @MessagePattern('compra_remove')
  async remove(data: CompraRequestDto): Promise<ReturnDeleteUpdateDto> {
    return await this.compraService.remove(data.id);
  }
}
