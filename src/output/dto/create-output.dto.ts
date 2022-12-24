import { IsNumber, IsString } from 'class-validator';

export class CreateOutputDto {
  @IsString()
  title: string;

  @IsNumber()
  categoryId: number;
}
