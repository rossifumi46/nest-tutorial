import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostionDto {
  @IsNumber()
  position: number;
}
