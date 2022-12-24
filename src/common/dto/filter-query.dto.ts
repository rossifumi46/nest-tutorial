import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

export class FilterQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  readonly category?: number;
}
