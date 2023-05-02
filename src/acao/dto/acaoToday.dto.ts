import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class acaoTodayDto {
  @ApiProperty({ description: 'The Name of Acao' })
  @IsString()
  @MinLength(5)
  acao: string;
}
