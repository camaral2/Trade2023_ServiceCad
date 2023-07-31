import { ApiProperty } from '@nestjs/swagger';

export class GetCompraDto {
  @ApiProperty({ example: '63b34f5da25fbb24d295ab24' })
  user: string;
  @ApiProperty({ example: 'MGLU3' })
  acao: string;
}
