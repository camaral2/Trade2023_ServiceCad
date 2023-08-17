import { ApiProperty } from '@nestjs/swagger';

export class SetSaleCompraDto {
  @ApiProperty({ example: '63b34f5da25fbb24d295ab24' })
  _id: string;
  @ApiProperty({ example: +new Date() })
  dateSale: Date;
  @ApiProperty({ example: 2.3 })
  valueSale: number;
  @ApiProperty({ example: 200 })
  qtdSale: number;
}
