import { IsNumber, IsPositive } from 'class-validator';

export class CreateLearningDto {
  @IsNumber()
  input: number;

  @IsNumber()
  output: number;

  @IsNumber()
  categoryId: number;

  @IsPositive()
  score: number;
}
