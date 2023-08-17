import { ApiProperty } from '@nestjs/swagger';
import { ICompra } from '../interfaces/compra.interface';
import { compraRequestSuccess } from '../mocks/compra-request-success.mock';

export class CompraRequestDto {
  @ApiProperty({
    example: {
      id: '63b34f5da25fbb24d295ab24',
    },
    nullable: true,
  })
  id: string;

  @ApiProperty({
    example: {
      compra: compraRequestSuccess,
    },
    nullable: true,
  })
  compra: ICompra;
}
