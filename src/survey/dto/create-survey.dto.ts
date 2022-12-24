import { IsNumber } from 'class-validator';

export class CreateSurveyDto {
  @IsNumber()
  readonly customerId: number;

  @IsNumber()
  readonly budget: number;
}
