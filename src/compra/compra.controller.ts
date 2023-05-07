import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ReturnDeleteUpdateDto } from './dto/return-delete-update-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';
import { MessagePattern } from '@nestjs/microservices';

@Controller('compra')
@UsePipes(new ValidationPipe())
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @MessagePattern('compra_create')
  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    return await this.compraService.create(createCompraDto);
  }

  @MessagePattern('compra_findAll')
  async findAll(user: string): Promise<Compra[]> {
    return await this.compraService.findAll(user);
  }

  @MessagePattern('compra_findOne')
  async findOne(id: string): Promise<Compra> {
    return await this.compraService.findOne(id);
  }

  @MessagePattern('compra_update')
  async update(
    id: string,
    updateCompraDto: UpdateCompraDto,
  ): Promise<ReturnDeleteUpdateDto> {
    return await this.compraService.update(id, updateCompraDto);
  }

  @MessagePattern('compra_remove')
  async remove(id: string): Promise<ReturnDeleteUpdateDto> {
    return await this.compraService.remove(id);
  }
}
